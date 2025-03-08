import cryto from 'crypto';
import { Entity, Index, PrimaryGeneratedColumn, Column, BaseEntity, DataSource } from 'typeorm'
import { encryptPassword, verifyPassword } from '@/service/security';
import { 
    DATABASE_HOST, 
    DATABASE_PORT, 
    DATABASE_USERNAME, 
    DATABASE_PASSWORD, 
    DATABASE_NAME,
    DEV_ENVIRONMENT,
    EXCHANGE_DURATION
} from '@/config';

@Entity()
@Index('unique_email', ['email'], { unique: true })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    username: string

    @Column()
    password: string
}

@Entity()
@Index('unique_code', ['code'], { unique: true })
export class Exchange extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({ type: 'uuid' })
    code: string

    @Column({ type: 'timestamp' })
    expired: Date
}

export const databaseConnection = new DataSource({
    type: "mysql",
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    synchronize: DEV_ENVIRONMENT,
    entities: [User, Exchange],
});

export async function addUser(email: string, password: string, username: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = await encryptPassword(password);
    return await User.create(user).save();
}

export async function getUser(email: string, password: string): Promise<User | null> {
    const user = await checkUser(email);
    if (!user) return null;
    const isMatch = await verifyPassword(password, user.password);
    return isMatch ? user : null;
}

export async function checkUser(email: string): Promise<User | null> {
    return await User.findOneBy({ email });
}

export async function generateExchange(email: string): Promise<string> {
    const exchange = new Exchange();
    exchange.email = email;
    exchange.code = cryto.randomUUID().toString();
    exchange.expired = new Date(Date.now() + EXCHANGE_DURATION * 1000);
    await Exchange.create(exchange).save();
    return exchange.code;
}

export async function getExchange(code: string): Promise<Exchange | null> {
    const exchange = await Exchange.findOneBy({ code });
    if (!exchange) return null;
    if (exchange.expired >= new Date()) {
        await exchange.remove();
        return null;
    }
    return exchange;
}


