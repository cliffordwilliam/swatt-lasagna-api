import { Person } from "../../../src/person/entities/person.entity";
import { PERSON_REPOSITORY } from "../../../src/person/repositories/person-repository";

describe("PERSON_REPOSITORY", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persistAndFlush: jest.fn(),
    };
  });

  describe("save", () => {
    it("should successfully save a valid person", async () => {
      const person = new Person();
      person.personName = "Test Person";

      const savedPerson = await PERSON_REPOSITORY.save(mockEm, person);

      expect(mockEm.persistAndFlush).toHaveBeenCalledWith(person);
      expect(savedPerson).toBe(person);
    });
  });
});
