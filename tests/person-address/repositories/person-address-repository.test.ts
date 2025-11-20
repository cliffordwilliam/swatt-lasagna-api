import { PersonAddress } from "../../../src/person-address/entities/person-address.entity";
import { PERSON_ADDRESS_REPOSITORY } from "../../../src/person-address/repositories/person-address-repository";
import { Person } from "../../../src/person/entities/person.entity";

describe("PERSON_ADDRESS_REPOSITORY", () => {
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
    it("should save an address without preferred flag", async () => {
      const address = new PersonAddress();
      address.address = "123 Test St";
      address.preferred = false;

      const result = await PERSON_ADDRESS_REPOSITORY.save(
        mockEm,
        address,
        mockPerson,
      );

      expect(mockEm.nativeUpdate).not.toHaveBeenCalled();
      expect(address.person).toBe(mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(address);
      expect(result).toBe(address);
    });

    it("should save a preferred address and unset other preferred addresses", async () => {
      const address = new PersonAddress();
      address.address = "123 Test St";
      address.preferred = true;

      mockEm.nativeUpdate.mockResolvedValue(undefined);

      const result = await PERSON_ADDRESS_REPOSITORY.save(
        mockEm,
        address,
        mockPerson,
      );

      expect(mockEm.nativeUpdate).toHaveBeenCalledWith(
        PersonAddress,
        {
          person: { personId: mockPerson.personId },
          preferred: true,
        },
        { preferred: false },
      );
      expect(address.person).toBe(mockPerson);
      expect(mockEm.persist).toHaveBeenCalledWith(address);
      expect(result).toBe(address);
    });

    it("should exclude current address when updating preferred addresses if addressId exists", async () => {
      const address = new PersonAddress();
      address.addressId = 5;
      address.address = "123 Test St";
      address.preferred = true;

      mockEm.nativeUpdate.mockResolvedValue(undefined);

      await PERSON_ADDRESS_REPOSITORY.save(mockEm, address, mockPerson);

      expect(mockEm.nativeUpdate).toHaveBeenCalledWith(
        PersonAddress,
        {
          person: { personId: mockPerson.personId },
          preferred: true,
          addressId: { $ne: address.addressId },
        },
        { preferred: false },
      );
    });
  });
});
