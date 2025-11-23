import { Person } from "../../../src/person/entities/person.entity";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { PersonPhone } from "../../../src/person-phone/entities/person-phone.entity";
import { PersonAddress } from "../../../src/person-address/entities/person-address.entity";

describe("PERSON_REPOSITORY", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persist: jest.fn(),
      findOneOrFail: jest.fn(),
      findAndCount: jest.fn(),
      populate: jest.fn(),
    };
  });

  describe("save", () => {
    it("should successfully save a valid person", async () => {
      const person = new Person();
      person.personName = "Test Person";

      const savedPerson = await PERSON_REPOSITORY.save(mockEm, person);

      expect(mockEm.persist).toHaveBeenCalledWith(person);
      expect(savedPerson).toBe(person);
    });
  });

  describe("getByIdOrFail", () => {
    it("should successfully get a person by id", async () => {
      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Test Person";

      mockEm.findOneOrFail.mockResolvedValue(mockPerson);

      const result = await PERSON_REPOSITORY.getByIdOrFail(mockEm, 1);

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(Person, {
        personId: 1,
      });
      expect(result).toBe(mockPerson);
    });
  });

  describe("list", () => {
    it("should list persons with no filters", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "personName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPerson1 = new Person();
      mockPerson1.personId = 1;
      mockPerson1.personName = "Person 1";
      mockPerson1.phones = [] as any;
      mockPerson1.addresses = [] as any;

      const mockPerson2 = new Person();
      mockPerson2.personId = 2;
      mockPerson2.personName = "Person 2";
      mockPerson2.phones = [] as any;
      mockPerson2.addresses = [] as any;

      const mockPersons = [mockPerson1, mockPerson2];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 2]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Person,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { personName: "asc" },
          populate: [
            "phones",
            "phones.person",
            "addresses",
            "addresses.person",
          ],
        },
      );
      expect(result.data).toHaveLength(2);
      expect(result.pagination.totalCount).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.pagination.hasNext).toBe(false);
      expect(result.pagination.hasPrevious).toBe(false);
    });

    it("should list persons with personName filter", async () => {
      const filters = {
        personName: "test",
        page: 1,
        pageSize: 10,
        sortField: "personName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Test Person";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 1]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Person,
        {
          $and: [{ personName: { $ilike: "%test%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { personName: "asc" },
          populate: [
            "phones",
            "phones.person",
            "addresses",
            "addresses.person",
          ],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list persons with or mode", async () => {
      const filters = {
        personName: "test",
        page: 1,
        pageSize: 10,
        sortField: "personName" as const,
        sortOrder: "asc" as const,
        mode: "or" as const,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Test Person";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 1]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Person,
        {
          $or: [{ personName: { $ilike: "%test%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { personName: "asc" },
          populate: [
            "phones",
            "phones.person",
            "addresses",
            "addresses.person",
          ],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list persons with desc sort order", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "personName" as const,
        sortOrder: "desc" as const,
        mode: "and" as const,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Person 1";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 1]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Person,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { personName: "desc" },
          populate: [
            "phones",
            "phones.person",
            "addresses",
            "addresses.person",
          ],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should handle pagination correctly", async () => {
      const filters = {
        page: 2,
        pageSize: 5,
        sortField: "personName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Person 1";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 12]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Person,
        {},
        {
          limit: 5,
          offset: 5,
          orderBy: { personName: "asc" },
          populate: [
            "phones",
            "phones.person",
            "addresses",
            "addresses.person",
          ],
        },
      );
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.pagination.totalCount).toBe(12);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrevious).toBe(true);
    });

    it("should map entities to include phones and addresses as arrays", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "personName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      const mockPhonePerson = new Person();
      mockPhonePerson.personId = 1;
      mockPhone.person = mockPhonePerson;

      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      const mockAddressPerson = new Person();
      mockAddressPerson.personId = 1;
      mockAddress.person = mockAddressPerson;

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Test Person";
      const phonesCollection = [mockPhone] as any;
      const addressesCollection = [mockAddress] as any;
      mockPerson.phones = phonesCollection;
      mockPerson.addresses = addressesCollection;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 1]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(result.data[0]).toHaveProperty("phones");
      expect(result.data[0]).toHaveProperty("addresses");
      expect(Array.isArray(result.data[0].phones)).toBe(true);
      expect(Array.isArray(result.data[0].addresses)).toBe(true);
      expect(result.data[0].phones[0]).toHaveProperty("personId");
      expect(result.data[0].addresses[0]).toHaveProperty("personId");
      expect(result.data[0].phones[0].personId).toBe(1);
      expect(result.data[0].addresses[0].personId).toBe(1);
    });

    it("should default to personName when sortField is invalid", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "invalid" as unknown as "personName",
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Person 1";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 1]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        Person,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { personName: "asc" },
          populate: [
            "phones",
            "phones.person",
            "addresses",
            "addresses.person",
          ],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should handle hasPrevious correctly on first page", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "personName" as const,
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;
      mockPerson.personName = "Person 1";
      mockPerson.phones = [] as any;
      mockPerson.addresses = [] as any;

      const mockPersons = [mockPerson];
      mockEm.findAndCount.mockResolvedValue([mockPersons, 1]);

      const result = await PERSON_REPOSITORY.list(mockEm, filters);

      expect(result.pagination.hasPrevious).toBe(false);
      expect(result.pagination.hasNext).toBe(false);
    });
  });
});
