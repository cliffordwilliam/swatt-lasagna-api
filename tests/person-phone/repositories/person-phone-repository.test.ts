import { PersonPhone } from "../../../src/person-phone/entities/person-phone.entity";
import { PERSON_PHONE_REPOSITORY } from "../../../src/person-phone/repositories/person-phone-repository";
import { Person } from "../../../src/person/entities/person.entity";
import { PersonPhoneFilter } from "../../../src/person-phone/schemas/person-phone";

describe("PERSON_PHONE_REPOSITORY", () => {
  let mockEm: any;
  let mockPerson: Person;

  beforeEach(() => {
    mockPerson = new Person();
    mockPerson.personId = 1;
    mockPerson.personName = "Test Person";

    mockEm = {
      nativeUpdate: jest.fn(),
      persist: jest.fn(),
      findOneOrFail: jest.fn(),
      findAndCount: jest.fn(),
      find: jest.fn(),
    };
  });

  describe("handleToggleDownPreferred", () => {
    it("should not toggle when phone is not preferred", async () => {
      const phone = new PersonPhone();
      phone.phoneNumber = "555-1234";
      phone.preferred = false;
      phone.person = mockPerson;

      await PERSON_PHONE_REPOSITORY.handleToggleDownPreferred(
        mockEm,
        phone,
        mockPerson,
      );

      expect(mockEm.find).not.toHaveBeenCalled();
    });

    it("should toggle down preferred phones when phone is preferred", async () => {
      const phone = new PersonPhone();
      phone.phoneNumber = "555-1234";
      phone.preferred = true;
      phone.person = mockPerson;

      const existingPreferred = new PersonPhone();
      existingPreferred.phoneId = 1;
      existingPreferred.preferred = true;
      existingPreferred.person = mockPerson;

      mockEm.find.mockResolvedValue([existingPreferred]);

      await PERSON_PHONE_REPOSITORY.handleToggleDownPreferred(
        mockEm,
        phone,
        mockPerson,
      );

      expect(mockEm.find).toHaveBeenCalledWith(PersonPhone, {
        person: { personId: mockPerson.personId },
        preferred: true,
      });
      expect(existingPreferred.preferred).toBe(false);
    });

    it("should exclude current phone when updating preferred phones if phoneId exists", async () => {
      const phone = new PersonPhone();
      phone.phoneId = 5;
      phone.phoneNumber = "555-1234";
      phone.preferred = true;

      const existingPreferred = new PersonPhone();
      existingPreferred.phoneId = 1;
      existingPreferred.preferred = true;
      existingPreferred.person = mockPerson;

      mockEm.find.mockResolvedValue([existingPreferred]);

      await PERSON_PHONE_REPOSITORY.handleToggleDownPreferred(
        mockEm,
        phone,
        mockPerson,
      );

      expect(mockEm.find).toHaveBeenCalledWith(PersonPhone, {
        person: { personId: mockPerson.personId },
        preferred: true,
        phoneId: { $ne: phone.phoneId },
      });
      expect(existingPreferred.preferred).toBe(false);
    });
  });

  describe("getByIdOrFail", () => {
    it("should successfully get a phone by id", async () => {
      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      mockPhone.preferred = true;
      mockPhone.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(mockPhone);

      const result = await PERSON_PHONE_REPOSITORY.getByIdOrFail(mockEm, 1);

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(
        PersonPhone,
        { phoneId: 1 },
        { populate: ["person"] },
      );
      expect(result).toBe(mockPhone);
    });
  });

  describe("list", () => {
    it("should list phones with no filters", async () => {
      const filters: PersonPhoneFilter = {
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone(), new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockPhones[1].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 2]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(2);
      expect(result.data[0].personId).toBe(1);
      expect(result.pagination.totalCount).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("should list phones with personId filter", async () => {
      const filters: PersonPhoneFilter = {
        personId: 1,
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {
          $and: [{ person: { personId: 1 } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list phones with phoneNumber filter", async () => {
      const filters: PersonPhoneFilter = {
        phoneNumber: "555",
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {
          $and: [{ phoneNumber: { $ilike: "%555%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list phones with preferred filter", async () => {
      const filters: PersonPhoneFilter = {
        preferred: true,
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {
          $and: [{ preferred: true }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list phones with or mode", async () => {
      const filters: PersonPhoneFilter = {
        phoneNumber: "555",
        preferred: true,
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "or",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {
          $or: [{ phoneNumber: { $ilike: "%555%" } }, { preferred: true }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list phones with preferred sort field", async () => {
      const filters: PersonPhoneFilter = {
        page: 1,
        pageSize: 10,
        sortField: "preferred",
        sortOrder: "desc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { preferred: "desc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should handle pagination correctly", async () => {
      const filters: PersonPhoneFilter = {
        page: 2,
        pageSize: 5,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 12]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {},
        {
          limit: 5,
          offset: 5,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.pageSize).toBe(5);
      expect(result.pagination.totalCount).toBe(12);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.pagination.hasNext).toBe(true);
      expect(result.pagination.hasPrevious).toBe(true);
    });

    it("should list phones with multiple filters in and mode", async () => {
      const filters: PersonPhoneFilter = {
        personId: 1,
        phoneNumber: "555",
        preferred: true,
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {
          $and: [
            { person: { personId: 1 } },
            { phoneNumber: { $ilike: "%555%" } },
            { preferred: true },
          ],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list phones with invalid sort field defaulting to phoneNumber", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "invalid" as unknown as "phoneNumber" | "preferred",
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockPhones = [new PersonPhone()];
      mockPhones[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockPhones, 1]);

      const result = await PERSON_PHONE_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonPhone,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { phoneNumber: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });
  });
});
