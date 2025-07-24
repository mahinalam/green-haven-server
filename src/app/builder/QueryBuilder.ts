import { FilterQuery, Query, Document } from "mongoose";

export class QueryBuilder<T extends Document> {
  public query: Record<string, unknown>;
  public modelQuery: Query<T[], T>;
  public filterConditions: FilterQuery<T> = {};
  public limit: number = 10;
  public skip: number = 0;
  public page: number = 1;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string;

    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: new RegExp(searchTerm, "i"),
            } as FilterQuery<T>)
        ),
      });
    }
    return this;
  }

  paginate() {
    this.limit = Number(this.query.limit || 10);
    this.page = Number(this.query.page || 1);
    this.skip = (this.page - 1) * this.limit;

    this.modelQuery = this.modelQuery.skip(this.skip).limit(this.limit);
    return this;
  }

  sort() {
    const sortBy = (this.query.sortBy as string) || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  fields() {
    if (this.query.fields) {
      const fields = (this.query.fields as string).split(",").join(" ");
      this.modelQuery = this.modelQuery.select(fields);
    } else {
      this.modelQuery = this.modelQuery.select("-__v");
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "page", "limit", "sortBy", "fields"];

    excludeFields.forEach((e) => delete queryObj[e]);

    this.filterConditions = {
      ...queryObj,
      isDeleted: false, // Always exclude deleted docs
    } as FilterQuery<T>;

    this.modelQuery = this.modelQuery.find(this.filterConditions);
    return this;
  }

  async execWithMeta(): Promise<{
    data: T[];
    meta: { total: number; page: number; limit: number };
  }> {
    const total = await this.modelQuery.model.countDocuments(
      this.filterConditions
    );
    const data = await this.modelQuery.exec();

    const meta = {
      total,
      page: this.page,
      limit: this.limit,
      skip: this.skip,
      pageCount: Math.ceil(total / this.limit),
    };

    return { meta, data };
  }
}
