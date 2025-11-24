import { PersonAddress } from "../../../src/person-address/entities/person-address.entity";
import { PERSON_ADDRESS_REPOSITORY } from "../../../src/person-address/repositories/person-address-repository";
import { Person } from "../../../src/person/entities/person.entity";
import { PersonAddressFilter } from "../../../src/person-address/schemas/person-address";

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
      findOneOrFail: jest.fn(),
      findAndCount: jest.fn(),
      find: jest.fn(),
    };
  });

  describe("handleToggleDownPreferred", () => {
    it("should not toggle when address is not preferred", async () => {
      const address = new PersonAddress();
      address.address = "123 Test St";
      address.preferred = false;
      address.person = mockPerson;

      await PERSON_ADDRESS_REPOSITORY.handleToggleDownPreferred(
        mockEm,
        address,
        mockPerson,
      );

      expect(mockEm.find).not.toHaveBeenCalled();
    });

    it("should toggle down preferred addresses when address is preferred", async () => {
      const address = new PersonAddress();
      address.address = "123 Test St";
      address.preferred = true;
      address.person = mockPerson;

      const existingPreferred = new PersonAddress();
      existingPreferred.addressId = 1;
      existingPreferred.preferred = true;
      existingPreferred.person = mockPerson;

      mockEm.find.mockResolvedValue([existingPreferred]);

      await PERSON_ADDRESS_REPOSITORY.handleToggleDownPreferred(
        mockEm,
        address,
        mockPerson,
      );

      expect(mockEm.find).toHaveBeenCalledWith(PersonAddress, {
        person: { personId: mockPerson.personId },
        preferred: true,
      });
      expect(existingPreferred.preferred).toBe(false);
    });

    it("should exclude current address when updating preferred addresses if addressId exists", async () => {
      const address = new PersonAddress();
      address.addressId = 5;
      address.address = "123 Test St";
      address.preferred = true;

      const existingPreferred = new PersonAddress();
      existingPreferred.addressId = 1;
      existingPreferred.preferred = true;
      existingPreferred.person = mockPerson;

      mockEm.find.mockResolvedValue([existingPreferred]);

      await PERSON_ADDRESS_REPOSITORY.handleToggleDownPreferred(
        mockEm,
        address,
        mockPerson,
      );

      expect(mockEm.find).toHaveBeenCalledWith(PersonAddress, {
        person: { personId: mockPerson.personId },
        preferred: true,
        addressId: { $ne: address.addressId },
      });
      expect(existingPreferred.preferred).toBe(false);
    });
  });

  describe("getByIdOrFail", () => {
    it("should successfully get an address by id", async () => {
      const mockAddress = new PersonAddress();
      mockAddress.addressId = 1;
      mockAddress.address = "123 Test St";
      mockAddress.preferred = true;
      mockAddress.person = mockPerson;

      mockEm.findOneOrFail.mockResolvedValue(mockAddress);

      const result = await PERSON_ADDRESS_REPOSITORY.getByIdOrFail(mockEm, 1);

      expect(mockEm.findOneOrFail).toHaveBeenCalledWith(
        PersonAddress,
        { addressId: 1 },
        { populate: ["person"] },
      );
      expect(result).toBe(mockAddress);
    });
  });

  describe("list", () => {
    it("should list addresses with no filters", async () => {
      const filters: PersonAddressFilter = {
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress(), new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockAddresses[1].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 2]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(2);
      expect(result.data[0].personId).toBe(1);
      expect(result.pagination.totalCount).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("should list addresses with personId filter", async () => {
      const filters: PersonAddressFilter = {
        personId: 1,
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {
          $and: [{ person: { personId: 1 } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list addresses with address filter", async () => {
      const filters: PersonAddressFilter = {
        address: "Test",
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {
          $and: [{ address: { $ilike: "%Test%" } }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list addresses with preferred filter", async () => {
      const filters: PersonAddressFilter = {
        preferred: true,
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {
          $and: [{ preferred: true }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list addresses with or mode", async () => {
      const filters: PersonAddressFilter = {
        address: "Test",
        preferred: true,
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "or",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {
          $or: [{ address: { $ilike: "%Test%" } }, { preferred: true }],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list addresses with preferred sort field", async () => {
      const filters: PersonAddressFilter = {
        page: 1,
        pageSize: 10,
        sortField: "preferred",
        sortOrder: "desc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
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
      const filters: PersonAddressFilter = {
        page: 2,
        pageSize: 5,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 12]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {},
        {
          limit: 5,
          offset: 5,
          orderBy: { address: "asc" },
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

    it("should list addresses with multiple filters in and mode", async () => {
      const filters: PersonAddressFilter = {
        personId: 1,
        address: "Test",
        preferred: true,
        page: 1,
        pageSize: 10,
        sortField: "address",
        sortOrder: "asc",
        mode: "and",
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {
          $and: [
            { person: { personId: 1 } },
            { address: { $ilike: "%Test%" } },
            { preferred: true },
          ],
        },
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });

    it("should list addresses with invalid sort field defaulting to address", async () => {
      const filters = {
        page: 1,
        pageSize: 10,
        sortField: "invalid" as unknown as "address" | "preferred",
        sortOrder: "asc" as const,
        mode: "and" as const,
      };

      const mockAddresses = [new PersonAddress()];
      mockAddresses[0].person = mockPerson;
      mockEm.findAndCount.mockResolvedValue([mockAddresses, 1]);

      const result = await PERSON_ADDRESS_REPOSITORY.list(mockEm, filters);

      expect(mockEm.findAndCount).toHaveBeenCalledWith(
        PersonAddress,
        {},
        {
          limit: 10,
          offset: 0,
          orderBy: { address: "asc" },
          populate: ["person"],
        },
      );
      expect(result.data).toHaveLength(1);
    });
  });
});
