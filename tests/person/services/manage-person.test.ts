import { Person } from "../../../src/person/entities/person.entity";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { MANAGE_PERSON } from "../../../src/person/services/manage-person";
import {
  PersonCreateRequest,
  PersonFilter,
  PersonUpdateRequest,
} from "../../../src/person/schemas/person";
import { PersonPhone } from "../../../src/person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../../src/person-address/entities/person-address.entity";
import { PERSON_PHONE_REPOSITORY } from "../../../src/person-phone/repositories/person-phone-repository";
import { PERSON_ADDRESS_REPOSITORY } from "../../../src/person-address/repositories/person-address-repository";
import { MANAGE_PERSON_PHONE } from "../../../src/person-phone/services/manage-person-phone";
import { MANAGE_PERSON_ADDRESS } from "../../../src/person-address/services/manage-person-address";
import { InvalidRequestParameterException } from "../../../src/api/models/error";

jest.mock("../../../src/person/repositories/person-repository", () => ({
  PERSON_REPOSITORY: {
    list: jest.fn(),
    getByIdOrFail: jest.fn(),
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

jest.mock("../../../src/person-phone/services/manage-person-phone", () => ({
  MANAGE_PERSON_PHONE: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../../../src/person-address/services/manage-person-address", () => ({
  MANAGE_PERSON_ADDRESS: {
    create: jest.fn(),
    update: jest.fn(),
  },
}));

const mockEm = {
  persist: jest.fn(),
  flush: jest.fn(),
  findOneOrFail: jest.fn(),
  populate: jest.fn(),
} as any;

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
      const phonesArray: any = [];
      createdPerson.phones = phonesArray;
      const addressesArray: any = [];
      createdPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.save as jest.Mock).mockResolvedValue(createdPerson);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.create(mockEm, personData);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Person),
      );
      expect(PERSON_PHONE_REPOSITORY.save).not.toHaveBeenCalled();
      expect(PERSON_ADDRESS_REPOSITORY.save).not.toHaveBeenCalled();
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(createdPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
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
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.create(mockEm, personData);

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
      expect(mockEm.populate).toHaveBeenCalledWith(createdPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
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
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.create(mockEm, personData);

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
      expect(mockEm.populate).toHaveBeenCalledWith(createdPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
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
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.create(mockEm, personData);

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
      expect(mockEm.populate).toHaveBeenCalledWith(createdPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
      expect(result.personId).toBe(1);
      expect(result.phones).toHaveLength(1);
      expect(result.addresses).toHaveLength(1);
    });

    it("should not flush when flush parameter is false", async () => {
      const personData: PersonCreateRequest = {
        personName: "Test Person",
        phoneNumber: "555-1234",
      };

      const createdPerson = new Person();
      createdPerson.personId = 1;
      createdPerson.personName = "Test Person";
      const phonesArray: any = [];
      createdPerson.phones = phonesArray;
      const addressesArray: any = [];
      createdPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.save as jest.Mock).mockResolvedValue(createdPerson);
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => {
          phone.person = person;
          person.phones.push(phone);
          return phone;
        },
      );
      await MANAGE_PERSON.create(mockEm, personData, false);

      expect(PERSON_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(Person),
      );
      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalled();
      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(createdPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
    });
  });

  describe("list", () => {
    it("should call PERSON_REPOSITORY.list with filters", async () => {
      const filters: PersonFilter = {
        page: 1,
        pageSize: 10,
        sortField: "personName",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Test Person";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockResult = {
        data: [mockPerson],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      (PERSON_REPOSITORY.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await MANAGE_PERSON.list(mockEm, filters);

      expect(PERSON_REPOSITORY.list).toHaveBeenCalledWith(mockEm, filters);
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("should call PERSON_REPOSITORY.getByIdOrFail and populate collections", async () => {
      const personId = 1;
      const mockPerson = new Person();
      mockPerson.personId = personId;
      mockPerson.personName = "Test Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      mockPerson.phones = phonesArray;
      mockPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.getById(mockEm, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(mockEm.populate).toHaveBeenCalledWith(mockPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
      expect(result).toEqual({
        ...mockPerson,
        phones: [],
        addresses: [],
      });
    });

    it("should map phones and addresses with personId from person relationship", async () => {
      const personId = 1;
      const mockPerson = new Person();
      mockPerson.personId = personId;
      mockPerson.personName = "Test Person";

      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      mockPhone.preferred = true;
      mockPhone.person = mockPerson;

      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      mockAddress.preferred = true;
      mockAddress.person = mockPerson;

      const phonesArray: any = [mockPhone];
      const addressesArray: any = [mockAddress];
      mockPerson.phones = phonesArray;
      mockPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.getById(mockEm, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(mockEm.populate).toHaveBeenCalledWith(mockPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
      expect(result.phones).toHaveLength(1);
      expect(result.phones[0].personId).toBe(personId);
      expect(result.addresses).toHaveLength(1);
      expect(result.addresses[0].personId).toBe(personId);
    });
  });

  describe("update", () => {
    it("should update a person with only personName", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(existingPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
      expect(MANAGE_PERSON_PHONE.create).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_PHONE.update).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_ADDRESS.create).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_ADDRESS.update).not.toHaveBeenCalled();
      expect(result.personName).toBe("Updated Person");
    });

    it("should update a person and create a new phone", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        phone: {
          phoneNumber: "555-9999",
          preferred: true,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_PHONE.create as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_PHONE.create).toHaveBeenCalledWith(
        mockEm,
        { personId, phoneNumber: "555-9999", preferred: true },
        false,
      );
      expect(MANAGE_PERSON_ADDRESS.create).not.toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(existingPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
    });

    it("should update a person and update an existing phone", async () => {
      const personId = 1;
      const phoneId = 10;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        phone: {
          phoneId,
          phoneNumber: "555-8888",
          preferred: true,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_PHONE.update as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_PHONE.update).toHaveBeenCalledWith(
        mockEm,
        phoneId,
        { phoneNumber: "555-8888", preferred: true },
        personId,
        false,
      );
      expect(MANAGE_PERSON_ADDRESS.update).not.toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(existingPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
    });

    it("should throw InvalidRequestParameterException when trying to set existing phone preferred from true to false", async () => {
      const personId = 1;
      const phoneId = 10;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        phone: {
          phoneId,
          phoneNumber: "555-8888",
          preferred: false,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_PHONE.update as jest.Mock).mockRejectedValue(
        new InvalidRequestParameterException(
          "Cannot set preferred to false. You can only toggle preferred from false to true.",
        ),
      );

      await expect(
        MANAGE_PERSON.update(mockEm, updates, personId),
      ).rejects.toThrow(InvalidRequestParameterException);

      await expect(
        MANAGE_PERSON.update(mockEm, updates, personId),
      ).rejects.toThrow(
        "Cannot set preferred to false. You can only toggle preferred from false to true.",
      );

      expect(MANAGE_PERSON_PHONE.update).toHaveBeenCalledWith(
        mockEm,
        phoneId,
        { phoneNumber: "555-8888", preferred: false },
        personId,
        false,
      );
      expect(MANAGE_PERSON_ADDRESS.update).not.toHaveBeenCalled();
    });

    it("should allow creating a new phone with preferred false", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        phone: {
          phoneNumber: "555-8888",
          preferred: false,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_PHONE.create as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_PHONE.create).toHaveBeenCalledWith(
        mockEm,
        { personId, phoneNumber: "555-8888", preferred: false },
        false,
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it("should allow updating existing phone with preferred false when existing is also false", async () => {
      const personId = 1;
      const phoneId = 10;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        phone: {
          phoneId,
          phoneNumber: "555-8888",
          preferred: false,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_PHONE.update as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(MANAGE_PERSON_PHONE.update).toHaveBeenCalledWith(
        mockEm,
        phoneId,
        { phoneNumber: "555-8888", preferred: false },
        personId,
        false,
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it("should update a person and create a new address", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        address: {
          address: "456 New St",
          preferred: true,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_ADDRESS.create as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_ADDRESS.create).toHaveBeenCalledWith(
        mockEm,
        { personId, address: "456 New St", preferred: true },
        false,
      );
      expect(MANAGE_PERSON_PHONE.create).not.toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(existingPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
    });

    it("should update a person and update an existing address", async () => {
      const personId = 1;
      const addressId = 20;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        address: {
          addressId,
          address: "789 Updated St",
          preferred: true,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_ADDRESS.update as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_ADDRESS.update).toHaveBeenCalledWith(
        mockEm,
        addressId,
        { address: "789 Updated St", preferred: true },
        personId,
        false,
      );
      expect(MANAGE_PERSON_PHONE.update).not.toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(existingPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
    });

    it("should throw InvalidRequestParameterException when trying to set existing address preferred from true to false", async () => {
      const personId = 1;
      const addressId = 20;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        address: {
          addressId,
          address: "789 Updated St",
          preferred: false,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_ADDRESS.update as jest.Mock).mockRejectedValue(
        new InvalidRequestParameterException(
          "Cannot set preferred to false. You can only toggle preferred from false to true.",
        ),
      );

      await expect(
        MANAGE_PERSON.update(mockEm, updates, personId),
      ).rejects.toThrow(InvalidRequestParameterException);

      await expect(
        MANAGE_PERSON.update(mockEm, updates, personId),
      ).rejects.toThrow(
        "Cannot set preferred to false. You can only toggle preferred from false to true.",
      );

      expect(MANAGE_PERSON_ADDRESS.update).toHaveBeenCalledWith(
        mockEm,
        addressId,
        { address: "789 Updated St", preferred: false },
        personId,
        false,
      );
      expect(MANAGE_PERSON_PHONE.update).not.toHaveBeenCalled();
    });

    it("should allow creating a new address with preferred false", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        address: {
          address: "789 Updated St",
          preferred: false,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_ADDRESS.create as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_ADDRESS.create).toHaveBeenCalledWith(
        mockEm,
        { personId, address: "789 Updated St", preferred: false },
        false,
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it("should allow updating existing address with preferred false when existing is also false", async () => {
      const personId = 1;
      const addressId = 20;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        address: {
          addressId,
          address: "789 Updated St",
          preferred: false,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_ADDRESS.update as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(MANAGE_PERSON_ADDRESS.update).toHaveBeenCalledWith(
        mockEm,
        addressId,
        { address: "789 Updated St", preferred: false },
        personId,
        false,
      );
      expect(mockEm.flush).toHaveBeenCalled();
    });

    it("should update a person with both phone and address", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
        phone: {
          phoneNumber: "555-7777",
          preferred: true,
        },
        address: {
          address: "999 Both St",
          preferred: true,
        },
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (MANAGE_PERSON_PHONE.create as jest.Mock).mockResolvedValue(undefined);
      (MANAGE_PERSON_ADDRESS.create as jest.Mock).mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_PHONE.create).toHaveBeenCalled();
      expect(MANAGE_PERSON_ADDRESS.create).toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalledWith(existingPerson, [
        "phones",
        "phones.person",
        "addresses",
        "addresses.person",
      ]);
    });

    it("should not flush when flush parameter is false", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Original Person";
      const phonesArray: any = [];
      const addressesArray: any = [];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      mockEm.populate.mockResolvedValue(undefined);

      await MANAGE_PERSON.update(mockEm, updates, personId, false);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(mockEm.persist).toHaveBeenCalledWith(existingPerson);
      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(mockEm.populate).toHaveBeenCalled();
    });

    it("should map phones and addresses with personId from person relationship in update", async () => {
      const personId = 1;
      const updates: PersonUpdateRequest = {
        personName: "Updated Person",
      };

      const existingPerson = new Person();
      existingPerson.personId = personId;
      existingPerson.personName = "Updated Person";

      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      mockPhone.preferred = true;
      mockPhone.person = existingPerson;

      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      mockAddress.preferred = true;
      mockAddress.person = existingPerson;

      const phonesArray: any = [mockPhone];
      const addressesArray: any = [mockAddress];
      existingPerson.phones = phonesArray;
      existingPerson.addresses = addressesArray;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      mockEm.flush.mockResolvedValue(undefined);
      mockEm.populate.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON.update(mockEm, updates, personId);

      expect(result.phones).toHaveLength(1);
      expect(result.phones[0].personId).toBe(personId);
      expect(result.addresses).toHaveLength(1);
      expect(result.addresses[0].personId).toBe(personId);
    });
  });
});
