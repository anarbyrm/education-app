import { SelectQueryBuilder } from "typeorm";
import { UserFilterQuery } from "./interfaces/user.interface";
import { BadRequestException } from "@nestjs/common";


export const buildQuery = <T>(qb: SelectQueryBuilder<T>, query: UserFilterQuery = {}) => {
    let { search, email, active, frozen } = query;

    if (search) qb = qb.where('firstName LIKE :firstName', { firstName: `%${search}%` })
                            .orWhere('lastName LIKE :lastName', { lastName: `%${search}%` })
                            .orWhere('email LIKE :email', { email: `%${search}%` });

    if (email) qb = qb.andWhere('email = :email', { email });

    if (active) {
        active = active.trim().toLocaleLowerCase();
        let value: number;
        if (active === 'false' || active === '0') {
            value = 0;
        } else if (active === 'true' || active === '1') {
            value = 1;
        } else {
            throw new BadRequestException('invalid "active" parameter value');
        }
        qb = qb.andWhere('isActive = :active', { active: value });
    }
    
    if (frozen) {
        frozen = frozen.trim().toLowerCase();
        let value: number;
        if (frozen === 'false' || frozen === '0') {
            value = 0;
        } else if (frozen === 'true' || frozen === '1') {
            value = 1;
        } else {
            throw new BadRequestException('invalid "frozen" parameter value');
        }
        qb = qb.andWhere('isFrozen = :frozen', { frozen: value });
    }

    return qb;
}