import { MANAGE_PERSON } from "../../../src/person/services/manage-person";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { MANAGE_PERSON_PHONE } from "../../../src/person-phone/services/manage-person-phone";
import { MANAGE_PERSON_ADDRESS } from "../../../src/person-address/services/manage-person-address";
import {
  PersonCreateRequest,
  PersonFilter,
  PersonUpdateRequest,
} from "../../../src/person/schemas/person";
import { Person } from "../../../src/person/entities/person.entity";

jest.mock("../../../src/person/repositories/person-repository", () => ({
  PERSON_REPOSITORY: {
    list: jest.fn(),
    getByIdOrFail: jest.fn(),
    populateRelations: jest.fn(),
  },
}));

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

describe("MANAGE_PERSON", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persist: jest.fn(),
      flush: jest.fn(),
    };
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("list", () => {
    it("calls PERSON_REPOSITORY.list with provided filters", async () => {
      const filters: PersonFilter = {
        page: 1,
        pageSize: 20,
        sortField: "personName",
        sortOrder: "asc",
        mode: "and",
      };

      const mockResult = { data: [], pagination: {} as any };
      (PERSON_REPOSITORY.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await MANAGE_PERSON.list(mockEm, filters);

      expect(PERSON_REPOSITORY.list).toHaveBeenCalledWith(mockEm, filters);
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("normalizes related phones and addresses", async () => {
      const phone = {
        phoneId: 1,
        phoneNumber: "555-1111",
        person: { personId: 10 },
      };
      const address = {
        addressId: 2,
        address: "123 Main",
        person: { personId: 10 },
      };

      const person = {
        personId: 5,
        personName: "Alice",
        phones: new Set([phone]),
        addresses: new Set([address]),
      } as unknown as Person;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(person);

      const result = await MANAGE_PERSON.getById(mockEm, 5);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(mockEm, 5);
      expect(result.phones).toEqual([
        { ...phone, personId: phone.person.personId },
      ]);
      expect(result.addresses).toEqual([
        { ...address, personId: address.person.personId },
      ]);
    });
  });

  describe("create", () => {
    it("delegates to createPersonEntity and normalizes response", async () => {
      const personData: PersonCreateRequest = {
        personName: "Bob",
        phoneNumber: "555-0000",
        address: "456 Broad",
      };

      const phone = {
        phoneId: 1,
        phoneNumber: "555-0000",
        person: { personId: 12 },
      };
      const address = {
        addressId: 2,
        address: "456 Broad",
        person: { personId: 12 },
      };

      const createdPerson = {
        personId: 12,
        personName: "Bob",
        phones: [phone],
        addresses: [address],
      } as unknown as Person;

      const spy = jest
        .spyOn(MANAGE_PERSON, "createPersonEntity")
        .mockResolvedValue(createdPerson);

      const result = await MANAGE_PERSON.create(mockEm, personData);

      expect(spy).toHaveBeenCalledWith(mockEm, personData, true);
      expect(result.phones).toEqual([
        { ...phone, personId: phone.person.personId },
      ]);
      expect(result.addresses).toEqual([
        { ...address, personId: address.person.personId },
      ]);
    });
  });

  describe("update", () => {
    it("delegates to updatePersonEntity and normalizes response", async () => {
      const updates: PersonUpdateRequest = {
        personName: "Updated",
      };
      const phone = {
        phoneId: 3,
        phoneNumber: "555-3333",
        person: { personId: 20 },
      };
      const address = {
        addressId: 4,
        address: "789 Circle",
        person: { personId: 20 },
      };
      const existingPerson = {
        personId: 20,
        personName: "Updated",
        phones: [phone],
        addresses: [address],
      } as unknown as Person;

      const spy = jest
        .spyOn(MANAGE_PERSON, "updatePersonEntity")
        .mockResolvedValue(existingPerson);

      const result = await MANAGE_PERSON.update(mockEm, updates, 20);

      expect(spy).toHaveBeenCalledWith(mockEm, updates, 20, true);
      expect(result.phones).toEqual([
        { ...phone, personId: phone.person.personId },
      ]);
      expect(result.addresses).toEqual([
        { ...address, personId: address.person.personId },
      ]);
    });
  });

  describe("createPersonEntity", () => {
    it("persists person, creates related records, flushes, and populates", async () => {
      const personData: PersonCreateRequest = {
        personName: "Carol",
        phoneNumber: "555-1111",
        address: "123 Main",
      };

      (PERSON_REPOSITORY.populateRelations as jest.Mock).mockResolvedValue(
        undefined,
      );
      const result = await MANAGE_PERSON.createPersonEntity(mockEm, personData);

      const persistedPerson = mockEm.persist.mock.calls[0][0] as Person;
      expect(persistedPerson.personName).toBe("Carol");
      expect(MANAGE_PERSON_PHONE.create).toHaveBeenCalledWith(
        mockEm,
        {
          personId: persistedPerson.personId,
          phoneNumber: "555-1111",
          preferred: true,
        },
        false,
        persistedPerson,
      );
      expect(MANAGE_PERSON_ADDRESS.create).toHaveBeenCalledWith(
        mockEm,
        {
          personId: persistedPerson.personId,
          address: "123 Main",
          preferred: true,
        },
        false,
        persistedPerson,
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(PERSON_REPOSITORY.populateRelations).toHaveBeenCalledWith(
        mockEm,
        persistedPerson,
      );
      expect(result).toBe(persistedPerson);
    });

    it("skips flush when flush flag is false", async () => {
      const personData: PersonCreateRequest = {
        personName: "Dave",
      };

      await MANAGE_PERSON.createPersonEntity(mockEm, personData, false);

      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_PHONE.create).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_ADDRESS.create).not.toHaveBeenCalled();
    });
  });

  describe("updatePersonEntity", () => {
    it("updates related entities when identifiers are provided", async () => {
      const personId = 42;
      const existingPerson = {
        personId,
        personName: "Original",
        phones: [],
        addresses: [],
      } as unknown as Person;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (PERSON_REPOSITORY.populateRelations as jest.Mock).mockResolvedValue(
        undefined,
      );

      const updates: PersonUpdateRequest = {
        personName: "Eve",
        phone: {
          phoneId: 100,
          phoneNumber: "111-2222",
          preferred: true,
        },
        address: {
          addressId: 200,
          address: "999 Elm",
          preferred: false,
        },
      };

      const result = await MANAGE_PERSON.updatePersonEntity(
        mockEm,
        updates,
        personId,
      );

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        personId,
      );
      expect(MANAGE_PERSON_PHONE.update).toHaveBeenCalledWith(
        mockEm,
        100,
        { phoneNumber: "111-2222", preferred: true },
        personId,
        false,
      );
      expect(MANAGE_PERSON_ADDRESS.update).toHaveBeenCalledWith(
        mockEm,
        200,
        { address: "999 Elm", preferred: false },
        personId,
        false,
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(PERSON_REPOSITORY.populateRelations).toHaveBeenCalledWith(
        mockEm,
        existingPerson,
      );
      expect(result).toBe(existingPerson);
      expect(existingPerson.personName).toBe("Eve");
    });

    it("creates new related entities and skips flush when asked", async () => {
      const personId = 55;
      const existingPerson = {
        personId,
        personName: "Original",
        phones: [],
        addresses: [],
      } as unknown as Person;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (PERSON_REPOSITORY.populateRelations as jest.Mock).mockResolvedValue(
        undefined,
      );

      const updates: PersonUpdateRequest = {
        phone: {
          phoneNumber: "333-4444",
          preferred: false,
        },
        address: {
          address: "111 Pine",
          preferred: true,
        },
      };

      await MANAGE_PERSON.updatePersonEntity(mockEm, updates, personId, false);

      expect(MANAGE_PERSON_PHONE.create).toHaveBeenCalledWith(
        mockEm,
        {
          personId,
          phoneNumber: "333-4444",
          preferred: false,
        },
        false,
        existingPerson,
      );
      expect(MANAGE_PERSON_ADDRESS.create).toHaveBeenCalledWith(
        mockEm,
        {
          personId,
          address: "111 Pine",
          preferred: true,
        },
        false,
        existingPerson,
      );
      expect(mockEm.flush).not.toHaveBeenCalled();
    });

    it("updates core fields when no phone or address payload is provided", async () => {
      const personId = 77;
      const existingPerson = {
        personId,
        personName: "Original",
        phones: [],
        addresses: [],
      } as unknown as Person;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        existingPerson,
      );
      (PERSON_REPOSITORY.populateRelations as jest.Mock).mockResolvedValue(
        undefined,
      );

      const updates: PersonUpdateRequest = {
        personName: "Only Name",
      };

      const result = await MANAGE_PERSON.updatePersonEntity(
        mockEm,
        updates,
        personId,
      );

      expect(MANAGE_PERSON_PHONE.update).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_PHONE.create).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_ADDRESS.update).not.toHaveBeenCalled();
      expect(MANAGE_PERSON_ADDRESS.create).not.toHaveBeenCalled();
      expect(result.personName).toBe("Only Name");
    });
  });
});
