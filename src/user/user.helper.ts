import { SelectQueryBuilder } from "typeorm";
import { IUserFilterQuery } from "./interfaces/user.interface";


export const buildQuery = <T>(qb: SelectQueryBuilder<T>, query: IUserFilterQuery = {}) => {
    const { search, email, active, frozen } = query;

    if (search) qb = qb.where('firstName LIKE :firstName', { firstName: `%${search}%` })
                            .orWhere('lastName LIKE :lastName', { lastName: `%${search}%` })
                            .orWhere('email LIKE :email', { email: `%${search}%` });

    if (email) qb = qb.andWhere('email = :email', { email });
    if (active) qb = qb.andWhere('isActive = :active', { active });
    if (frozen) qb = qb.andWhere('isFrozen = :frozen', { frozen });

    return qb;
}