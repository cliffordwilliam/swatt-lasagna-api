import { filterDefinedValues } from "../../../src/common/utils/defined_entries";
import { WaffleRepository } from "../../../src/waffles/repositories/waffle_repository";
import { WaffleEntity } from "../../../src/waffles/entities/waffle.entity";
import { getEM } from "../../../src/core/database/adapter";

jest.mock("../../../src/core/database/adapter", () => ({
  getEM: jest.fn(),
}));

describe("WaffleRepository", () => {
  let mockEm: any;

  beforeEach(() => {
    mockEm = {
      persistAndFlush: jest.fn(),
    };
    (getEM as jest.Mock).mockResolvedValue(mockEm);
  });

  it("should successfully save a valid waffle", async () => {
    const waffle_data = {
      waffle_name: "choco",
      waffle_category: "sour",
    };

    const waffleEntity = new WaffleEntity();
    Object.assign(waffleEntity, filterDefinedValues(waffle_data));

    const savedWaffle = await WaffleRepository.save(waffleEntity);

    expect(mockEm.persistAndFlush).toHaveBeenCalledWith(waffleEntity);

    expect(savedWaffle).toBe(waffleEntity);
  });
});
