import { Person } from "../../../src/person/entities/person.entity";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { MANAGE_PERSON } from "../../../src/person/services/manage-person";
import { PersonCreateRequest } from "../../../src/person/schemas/person";
import { PersonPhone } from "../../../src/person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../../src/person-address/entities/person-address.entity";
import { PERSON_PHONE_REPOSITORY } from "../../../src/person-phone/repositories/person-phone-repository";
import { PERSON_ADDRESS_REPOSITORY } from "../../../src/person-address/repositories/person-address-repository";

jest.mock("../../../src/person/repositories/person-repository", () => ({
  PERSON_REPOSITORY: {
    save: jest.fn(),
  },
}));

jest.mock(
  "../../../src/person-phone/repositories/person-phone-repository",
  () => ({
    PERSON_PHONE_REPOSITORY: {
      save: jest.fn(),
    },
  }),
);

jest.mock(
  "../../../src/person-address/repositories/person-address-repository",
  () => ({
    PERSON_ADDRESS_REPOSITORY: {
      save: jest.fn(),
    },
  }),
);

const mockEm = {
  persistAndFlush: jest.fn(),
  persist: jest.fn(),
  flush: jest.fn(),
  findOneOrFail: jest.fn(),
} as any;

jest.mock("../../../src/common/utils/transactional", () => ({
  __esModule: true,
  default: jest.fn((fn) => fn(mockEm)),
}));

describe("MANAGE_PERSON", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("dtoToEntities", () => {
    it("should convert DTO with only personName to entities", () => {
      const dto: PersonCreateRequest = {
        personName: "Test Person",
      };

      const result = MANAGE_PERSON.dtoToEntities(dto);

      expect(result.person).toBeInstanceOf(Person);
      expect(result.person.personName).toBe("Test Person");
      expect(result.phone).toBeNull();
      expect(result.address).toBeNull();
    });

    it("should convert DTO with personName and phoneNumber to entities", () => {
      const dto: PersonCreateRequest = {
        personName: "Test Person",
        phoneNumber: "555-1234",
      };

      const result = MANAGE_PERSON.dtoToEntities(dto);

      expect(result.person).toBeInstanceOf(Person);
      expect(result.person.personName).toBe("Test Person");
      expect(result.phone).toBeInstanceOf(PersonPhone);
      expect(result.phone?.phoneNumber).toBe("555-1234");
      expect(result.phone?.preferred).toBe(true);
      expect(result.address).toBeNull();
    });

    it("should convert DTO with personName and address to entities", () => {
      const dto: PersonCreateRequest = {
        personName: "Test Person",
        address: "123 Test St",
      };

      const result = MANAGE_PERSON.dtoToEntities(dto);

      expect(result.person).toBeInstanceOf(Person);
      expect(result.person.personName).toBe("Test Person");
      expect(result.phone).toBeNull();
      expect(result.address).toBeInstanceOf(PersonAddress);
      expect(result.address?.address).toBe("123 Test St");
      expect(result.address?.preferred).toBe(true);
    });

    it("should convert DTO with all fields to entities", () => {
      const dto: PersonCreateRequest = {
        personName: "Test Person",
        phoneNumber: "555-1234",
        address: "123 Test St",
      };

      const result = MANAGE_PERSON.dtoToEntities(dto);

      expect(result.person).toBeInstanceOf(Person);
      expect(result.person.personName).toBe("Test Person");
      expect(result.phone).toBeInstanceOf(PersonPhone);
      expect(result.phone?.phoneNumber).toBe("555-1234");
      expect(result.phone?.preferred).toBe(true);
      expect(result.address).toBeInstanceOf(PersonAddress);
      expect(result.address?.address).toBe("123 Test St");
      expect(result.address?.preferred).toBe(true);
    });
  });

  describe("create", () => {
    it("should create a person with only personName", async () => {
      const personData: PersonCreateRequest = {
        personName: "Test Person",
      };

      const createdPerson = new Person();
      createdPerson.personId = 1;
      createdPerson.personName = "Test Person";
      // Collections need to be iterable for Array.from()
      createdPerson.phones = [] as any;
      createdPerson.addresses = [] as any;

      (PERSON_REPOSITORY.save as jest.Mock).mockResolvedValue(createdPerson);

      const result = await MANAGE_PERSON.create(personData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Person),
      );
      expect(PERSON_PHONE_REPOSITORY.save).not.toHaveBeenCalled();
      expect(PERSON_ADDRESS_REPOSITORY.save).not.toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.findOneOrFail).not.toHaveBeenCalled();
      expect(result.personId).toBe(1);
      expect(result.personName).toBe("Test Person");
    });

    it("should create a person with phoneNumber", async () => {
      const personData: PersonCreateRequest = {
        personName: "Test Person",
        phoneNumber: "555-1234",
      };

      const createdPerson = new Person();
      createdPerson.personId = 1;
      createdPerson.personName = "Test Person";

      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      mockPhone.preferred = true;

      // Create mock collections that are iterable
      const phonesArray: any = [];
      createdPerson.phones = phonesArray;

      const addressesArray: any = [];
      createdPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.save as jest.Mock).mockResolvedValue(createdPerson);
      // Simulate MikroORM's automatic collection syncing when phone.person is set
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => {
          phone.person = person;
          person.phones.push(phone); // Simulate MikroORM's automatic syncing
          return phone;
        },
      );

      const result = await MANAGE_PERSON.create(personData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Person),
      );
      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(PersonPhone),
        createdPerson,
      );
      expect(PERSON_ADDRESS_REPOSITORY.save).not.toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.findOneOrFail).not.toHaveBeenCalled();
      expect(result.personId).toBe(1);
      expect(result.phones).toHaveLength(1);
    });

    it("should create a person with address", async () => {
      const personData: PersonCreateRequest = {
        personName: "Test Person",
        address: "123 Test St",
      };

      const createdPerson = new Person();
      createdPerson.personId = 1;
      createdPerson.personName = "Test Person";

      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      mockAddress.preferred = true;

      // Create mock collections that are iterable
      const phonesArray: any = [];
      createdPerson.phones = phonesArray;

      const addressesArray: any = [];
      createdPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.save as jest.Mock).mockResolvedValue(createdPerson);
      // Simulate MikroORM's automatic collection syncing when address.person is set
      (PERSON_ADDRESS_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, address, person) => {
          address.person = person;
          person.addresses.push(address); // Simulate MikroORM's automatic syncing
          return address;
        },
      );

      const result = await MANAGE_PERSON.create(personData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Person),
      );
      expect(PERSON_PHONE_REPOSITORY.save).not.toHaveBeenCalled();
      expect(PERSON_ADDRESS_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(PersonAddress),
        createdPerson,
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.findOneOrFail).not.toHaveBeenCalled();
      expect(result.personId).toBe(1);
      expect(result.addresses).toHaveLength(1);
    });

    it("should create a person with phoneNumber and address", async () => {
      const personData: PersonCreateRequest = {
        personName: "Test Person",
        phoneNumber: "555-1234",
        address: "123 Test St",
      };

      const createdPerson = new Person();
      createdPerson.personId = 1;
      createdPerson.personName = "Test Person";

      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      mockPhone.preferred = true;

      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      mockAddress.preferred = true;

      // Create mock collections that are iterable
      const phonesArray: any = [];
      createdPerson.phones = phonesArray;

      const addressesArray: any = [];
      createdPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.save as jest.Mock).mockResolvedValue(createdPerson);
      // Simulate MikroORM's automatic collection syncing when phone.person is set
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => {
          phone.person = person;
          person.phones.push(phone); // Simulate MikroORM's automatic syncing
          return phone;
        },
      );
      // Simulate MikroORM's automatic collection syncing when address.person is set
      (PERSON_ADDRESS_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, address, person) => {
          address.person = person;
          person.addresses.push(address); // Simulate MikroORM's automatic syncing
          return address;
        },
      );

      const result = await MANAGE_PERSON.create(personData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Person),
      );
      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(PersonPhone),
        createdPerson,
      );
      expect(PERSON_ADDRESS_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(PersonAddress),
        createdPerson,
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.findOneOrFail).not.toHaveBeenCalled();
      expect(result.personId).toBe(1);
      expect(result.phones).toHaveLength(1);
      expect(result.addresses).toHaveLength(1);
    });
  });
});
