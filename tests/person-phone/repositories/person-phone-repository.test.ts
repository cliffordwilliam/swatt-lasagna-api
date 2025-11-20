import { PersonPhone } from "../../../src/person-phone/entities/person-phone.entity";
import { PERSON_PHONE_REPOSITORY } from "../../../src/person-phone/repositories/person-phone-repository";
import { Person } from "../../../src/person/entities/person.entity";

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
    };
  });

  describe("save", () => {
    it("should save a phone without preferred flag", async () => {
      const phone = new PersonPhone();
      phone.phoneNumber = "555-1234";
      phone.preferred = false;

      const result = await PERSON_PHONE_REPOSITORY.save(
        mockEm,
        phone,
        mockPerson,
      );

      expect(mockEm.nativeUpdate).not.toHaveBeenCalled();
      expect(phone.person).toBe(mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(phone);
      expect(result).toBe(phone);
    });

    it("should save a preferred phone and unset other preferred phones", async () => {
      const phone = new PersonPhone();
      phone.phoneNumber = "555-1234";
      phone.preferred = true;

      mockEm.nativeUpdate.mockResolvedValue(undefined);

      const result = await PERSON_PHONE_REPOSITORY.save(
        mockEm,
        phone,
        mockPerson,
      );

      expect(mockEm.nativeUpdate).toHaveBeenCalledWith(
        PersonPhone,
        {
          person: { personId: mockPerson.personId },
          preferred: true,
        },
        { preferred: false },
      );
      expect(phone.person).toBe(mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(phone);
      expect(result).toBe(phone);
    });

    it("should exclude current phone when updating preferred phones if phoneId exists", async () => {
      const phone = new PersonPhone();
      phone.phoneId = 5;
      phone.phoneNumber = "555-1234";
      phone.preferred = true;

      mockEm.nativeUpdate.mockResolvedValue(undefined);

      await PERSON_PHONE_REPOSITORY.save(mockEm, phone, mockPerson);

      expect(mockEm.nativeUpdate).toHaveBeenCalledWith(
        PersonPhone,
        {
          person: { personId: mockPerson.personId },
          preferred: true,
          phoneId: { $ne: phone.phoneId },
        },
        { preferred: false },
      );
    });
  });
});
