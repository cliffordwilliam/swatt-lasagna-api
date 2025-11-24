import { PersonAddress } from "../../../src/person-address/entities/person-address.entity";
import { PERSON_ADDRESS_REPOSITORY } from "../../../src/person-address/repositories/person-address-repository";
import { MANAGE_PERSON_ADDRESS } from "../../../src/person-address/services/manage-person-address";
import {
  PersonAddressCreateRequest,
  PersonAddressUpdateRequest,
  PersonAddressFilter,
} from "../../../src/person-address/schemas/person-address";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { Person } from "../../../src/person/entities/person.entity";
import { InvalidRequestParameterException } from "../../../src/api/models/error";

jest.mock(
  "../../../src/person-address/repositories/person-address-repository",
  () => ({
    PERSON_ADDRESS_REPOSITORY: {
      getByIdOrFail: jest.fn(),
      list: jest.fn(),
      toggleDownPreferred: jest.fn(),
    },
  }),
);

jest.mock("../../../src/person/repositories/person-repository", () => ({
  PERSON_REPOSITORY: {
    getByIdOrFail: jest.fn(),
  },
}));

const mockEm = {
  flush: jest.fn(),
  findOneOrFail: jest.fn(),
  persist: jest.fn(),
} as any;

describe("MANAGE_PERSON_ADDRESS", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should call PERSON_ADDRESS_REPOSITORY.list with filters", async () => {
      const filters: PersonAddressFilter = {
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockResult = {
        data: [new PersonAddress()],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      (PERSON_ADDRESS_REPOSITORY.list as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await MANAGE_PERSON_ADDRESS.list(mockEm, filters);

      expect(PERSON_ADDRESS_REPOSITORY.list).toHaveBeenCalledWith(
        mockEm,
        filters,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("should call PERSON_ADDRESS_REPOSITORY.getByIdOrFail with addressId", async () => {
      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      mockAddress.preferred = true;
      const mockPerson = new Person();
      mockPerson.personId = 10;
      mockAddress.person = mockPerson;

      (PERSON_ADDRESS_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockAddress,
      );

      const result = await MANAGE_PERSON_ADDRESS.getById(mockEm, 1);

      expect(PERSON_ADDRESS_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        1,
      );
      expect(result).toEqual({
        ...mockAddress,
        personId: 10,
      });
    });
  });

  describe("create", () => {
    it("should create a new address with provided data", async () => {
      const addressData: PersonAddressCreateRequest = {
        personId: 1,
        address: "123 Test St",
        preferred: true,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;

      const newAddress = new PersonAddress();
      newAddress.address = "123 Test St";
      newAddress.preferred = true;
      newAddress.person = mockPerson;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {
        address.person = person;
      });
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_ADDRESS.create(mockEm, addressData);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(mockEm, 1);
      expect(
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred,
      ).toHaveBeenCalledWith(mockEm, expect.any(PersonAddress), mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(expect.any(PersonAddress));
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.personId).toBe(1);
    });

    it("should not flush when flush parameter is false", async () => {
      const addressData: PersonAddressCreateRequest = {
        personId: 1,
        address: "456 Test Ave",
        preferred: false,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {
        address.person = person;
      });
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_ADDRESS.create(
        mockEm,
        addressData,
        false,
      );

      expect(
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred,
      ).toHaveBeenCalledWith(mockEm, expect.any(PersonAddress), mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(expect.any(PersonAddress));
      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(result.personId).toBe(1);
    });

    it("should flush when flush parameter is true", async () => {
      const addressData: PersonAddressCreateRequest = {
        personId: 1,
        address: "123 Test St",
        preferred: true,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {
        address.person = person;
      });
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      await MANAGE_PERSON_ADDRESS.create(mockEm, addressData, true);

      expect(mockEm.flush).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update an existing address with provided updates", async () => {
      const addressId = 1;
      const personId = 10;
      const updates: PersonAddressUpdateRequest = {
        address: "456 New St",
        preferred: true,
      };

      const existingAddress = new PersonAddress();
      existingAddress.addressId = addressId;
      existingAddress.address = "123 Old St";
      existingAddress.preferred = false;
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingAddress.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingAddress);
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {});
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_ADDRESS.update(
        mockEm,
        addressId,
        updates,
        personId,
      );

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(PersonAddress, {
        addressId,
        person: { personId },
      });
      expect(
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred,
      ).toHaveBeenCalledWith(mockEm, existingAddress, mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(existingAddress);
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.personId).toBe(personId);
    });

    it("should throw InvalidRequestParameterException when trying to set preferred from true to false", async () => {
      const addressId = 1;
      const personId = 10;
      const updates: PersonAddressUpdateRequest = {
        address: "456 New St",
        preferred: false,
      };

      const existingAddress = new PersonAddress();
      existingAddress.addressId = addressId;
      existingAddress.address = "123 Old St";
      existingAddress.preferred = true; // Existing address has preferred: true
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingAddress.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingAddress);

      await expect(
        MANAGE_PERSON_ADDRESS.update(mockEm, addressId, updates, personId),
      ).rejects.toThrow(InvalidRequestParameterException);

      await expect(
        MANAGE_PERSON_ADDRESS.update(mockEm, addressId, updates, personId),
      ).rejects.toThrow(
        "Cannot set preferred to false. You can only toggle preferred from false to true.",
      );

      expect(
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred,
      ).not.toHaveBeenCalled();
    });

    it("should allow updating preferred from false to true", async () => {
      const addressId = 1;
      const personId = 10;
      const updates: PersonAddressUpdateRequest = {
        address: "456 New St",
        preferred: true,
      };

      const existingAddress = new PersonAddress();
      existingAddress.addressId = addressId;
      existingAddress.address = "123 Old St";
      existingAddress.preferred = false; // Existing address has preferred: false
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingAddress.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingAddress);
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {});
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_ADDRESS.update(
        mockEm,
        addressId,
        updates,
        personId,
      );

      expect(PERSON_ADDRESS_REPOSITORY.toggleDownPreferred).toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalled();
      expect(result.personId).toBe(personId);
    });

    it("should allow updating preferred from false to false", async () => {
      const addressId = 1;
      const personId = 10;
      const updates: PersonAddressUpdateRequest = {
        address: "456 New St",
        preferred: false,
      };

      const existingAddress = new PersonAddress();
      existingAddress.addressId = addressId;
      existingAddress.address = "123 Old St";
      existingAddress.preferred = false; // Existing address has preferred: false
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingAddress.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingAddress);
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {});
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_ADDRESS.update(
        mockEm,
        addressId,
        updates,
        personId,
      );

      expect(PERSON_ADDRESS_REPOSITORY.toggleDownPreferred).toHaveBeenCalled();
      expect(mockEm.persist).toHaveBeenCalled();
      expect(result.personId).toBe(personId);
    });

    it("should not flush when flush parameter is false", async () => {
      const addressId = 1;
      const personId = 10;
      const updates: PersonAddressUpdateRequest = {
        address: "456 New St",
        preferred: true,
      };

      const existingAddress = new PersonAddress();
      existingAddress.addressId = addressId;
      existingAddress.preferred = false;
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingAddress.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingAddress);
      (
        PERSON_ADDRESS_REPOSITORY.toggleDownPreferred as jest.Mock
      ).mockImplementation(async (em, address, person) => {});
      mockEm.persist.mockResolvedValue(undefined);
      mockEm.flush.mockResolvedValue(undefined);

      await MANAGE_PERSON_ADDRESS.update(
        mockEm,
        addressId,
        updates,
        personId,
        false,
      );

      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });
});
