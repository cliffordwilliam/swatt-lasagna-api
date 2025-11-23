import { PersonPhone } from "../../../src/person-phone/entities/person-phone.entity";
import { PERSON_PHONE_REPOSITORY } from "../../../src/person-phone/repositories/person-phone-repository";
import { MANAGE_PERSON_PHONE } from "../../../src/person-phone/services/manage-person-phone";
import {
  PersonPhoneCreateRequest,
  PersonPhoneUpdateRequest,
  PersonPhoneFilter,
} from "../../../src/person-phone/schemas/person-phone";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";
import { Person } from "../../../src/person/entities/person.entity";
import { InvalidRequestParameterException } from "../../../src/api/models/error";

jest.mock(
  "../../../src/person-phone/repositories/person-phone-repository",
  () => ({
    PERSON_PHONE_REPOSITORY: {
      getByIdOrFail: jest.fn(),
      list: jest.fn(),
      save: jest.fn(),
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
} as any;

describe("MANAGE_PERSON_PHONE", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("list", () => {
    it("should call PERSON_PHONE_REPOSITORY.list with filters", async () => {
      const filters: PersonPhoneFilter = {
        page: 1,
        pageSize: 10,
        sortField: "phoneNumber",
        sortOrder: "asc",
        mode: "and",
      };

      const mockResult = {
        data: [new PersonPhone()],
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };

      (PERSON_PHONE_REPOSITORY.list as jest.Mock).mockResolvedValue(mockResult);

      const result = await MANAGE_PERSON_PHONE.list(mockEm, filters);

      expect(PERSON_PHONE_REPOSITORY.list).toHaveBeenCalledWith(
        mockEm,
        filters,
      );
      expect(result).toBe(mockResult);
    });
  });

  describe("getById", () => {
    it("should call PERSON_PHONE_REPOSITORY.getByIdOrFail with phoneId", async () => {
      const mockPhone = new PersonPhone();
      mockPhone.phoneId = 1;
      mockPhone.phoneNumber = "555-1234";
      mockPhone.preferred = true;
      const mockPerson = new Person();
      mockPerson.personId = 10;
      mockPhone.person = mockPerson;

      (PERSON_PHONE_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPhone,
      );

      const result = await MANAGE_PERSON_PHONE.getById(mockEm, 1);

      expect(PERSON_PHONE_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(
        mockEm,
        1,
      );
      expect(result).toEqual({
        ...mockPhone,
        personId: 10,
      });
    });
  });

  describe("create", () => {
    it("should create a new phone with provided data", async () => {
      const phoneData: PersonPhoneCreateRequest = {
        personId: 1,
        phoneNumber: "555-1234",
        preferred: true,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;

      const newPhone = new PersonPhone();
      newPhone.phoneNumber = "555-1234";
      newPhone.preferred = true;
      newPhone.person = mockPerson;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => {
          phone.person = person;
          return phone;
        },
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_PHONE.create(mockEm, phoneData);

      expect(PERSON_REPOSITORY.getByIdOrFail).toHaveBeenCalledWith(mockEm, 1);
      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(PersonPhone),
        mockPerson,
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.personId).toBe(1);
    });

    it("should not flush when flush parameter is false", async () => {
      const phoneData: PersonPhoneCreateRequest = {
        personId: 1,
        phoneNumber: "555-5678",
        preferred: false,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => {
          phone.person = person;
          return phone;
        },
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_PHONE.create(mockEm, phoneData, false);

      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        expect.any(PersonPhone),
        mockPerson,
      );
      expect(mockEm.flush).not.toHaveBeenCalled();
      expect(result.personId).toBe(1);
    });

    it("should flush when flush parameter is true", async () => {
      const phoneData: PersonPhoneCreateRequest = {
        personId: 1,
        phoneNumber: "555-1234",
        preferred: true,
      };

      const mockPerson = new Person();
      mockPerson.personId = 1;

      (PERSON_REPOSITORY.getByIdOrFail as jest.Mock).mockResolvedValue(
        mockPerson,
      );
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => {
          phone.person = person;
          return phone;
        },
      );
      mockEm.flush.mockResolvedValue(undefined);

      await MANAGE_PERSON_PHONE.create(mockEm, phoneData, true);

      expect(mockEm.flush).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update an existing phone with provided updates", async () => {
      const phoneId = 1;
      const personId = 10;
      const updates: PersonPhoneUpdateRequest = {
        phoneNumber: "555-9999",
        preferred: true,
      };

      const existingPhone = new PersonPhone();
      existingPhone.phoneId = phoneId;
      existingPhone.phoneNumber = "555-1234";
      existingPhone.preferred = false;
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingPhone.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingPhone);
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => phone,
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_PHONE.update(
        mockEm,
        phoneId,
        updates,
        personId,
      );

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(PersonPhone, {
        phoneId,
        person: { personId },
      });
      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalledWith(
        mockEm,
        existingPhone,
        mockPerson,
      );
      expect(mockEm.flush).toHaveBeenCalled();
      expect(result.personId).toBe(personId);
    });

    it("should throw InvalidRequestParameterException when trying to set preferred from true to false", async () => {
      const phoneId = 1;
      const personId = 10;
      const updates: PersonPhoneUpdateRequest = {
        phoneNumber: "555-9999",
        preferred: false,
      };

      const existingPhone = new PersonPhone();
      existingPhone.phoneId = phoneId;
      existingPhone.phoneNumber = "555-1234";
      existingPhone.preferred = true; // Existing phone has preferred: true
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingPhone.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingPhone);

      await expect(
        MANAGE_PERSON_PHONE.update(mockEm, phoneId, updates, personId),
      ).rejects.toThrow(InvalidRequestParameterException);

      await expect(
        MANAGE_PERSON_PHONE.update(mockEm, phoneId, updates, personId),
      ).rejects.toThrow(
        "Cannot set preferred to false. You can only toggle preferred from false to true.",
      );

      expect(PERSON_PHONE_REPOSITORY.save).not.toHaveBeenCalled();
    });

    it("should allow updating preferred from false to true", async () => {
      const phoneId = 1;
      const personId = 10;
      const updates: PersonPhoneUpdateRequest = {
        phoneNumber: "555-9999",
        preferred: true,
      };

      const existingPhone = new PersonPhone();
      existingPhone.phoneId = phoneId;
      existingPhone.phoneNumber = "555-1234";
      existingPhone.preferred = false; // Existing phone has preferred: false
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingPhone.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingPhone);
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => phone,
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_PHONE.update(
        mockEm,
        phoneId,
        updates,
        personId,
      );

      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalled();
      expect(result.personId).toBe(personId);
    });

    it("should allow updating preferred from false to false", async () => {
      const phoneId = 1;
      const personId = 10;
      const updates: PersonPhoneUpdateRequest = {
        phoneNumber: "555-9999",
        preferred: false,
      };

      const existingPhone = new PersonPhone();
      existingPhone.phoneId = phoneId;
      existingPhone.phoneNumber = "555-1234";
      existingPhone.preferred = false; // Existing phone has preferred: false
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingPhone.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingPhone);
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => phone,
      );
      mockEm.flush.mockResolvedValue(undefined);

      const result = await MANAGE_PERSON_PHONE.update(
        mockEm,
        phoneId,
        updates,
        personId,
      );

      expect(PERSON_PHONE_REPOSITORY.save).toHaveBeenCalled();
      expect(result.personId).toBe(personId);
    });

    it("should not flush when flush parameter is false", async () => {
      const phoneId = 1;
      const personId = 10;
      const updates: PersonPhoneUpdateRequest = {
        phoneNumber: "555-9999",
        preferred: true,
      };

      const existingPhone = new PersonPhone();
      existingPhone.phoneId = phoneId;
      existingPhone.preferred = false;
      const mockPerson = new Person();
      mockPerson.personId = personId;
      existingPhone.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(existingPhone);
      (PERSON_PHONE_REPOSITORY.save as jest.Mock).mockImplementation(
        async (em, phone, person) => phone,
      );
      mockEm.flush.mockResolvedValue(undefined);

      await MANAGE_PERSON_PHONE.update(
        mockEm,
        phoneId,
        updates,
        personId,
        false,
      );

      expect(mockEm.flush).not.toHaveBeenCalled();
    });
  });
});
