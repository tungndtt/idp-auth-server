import { randomInt } from 'crypto';
import { 
    Entity, 
    Index, 
    PrimaryGeneratedColumn, 
    Column, 
    BaseEntity, 
    DataSource, 
    LessThan,
    MoreThan, 
} from 'typeorm'
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

    @Column()
    code: string

    @Column({ type: 'timestamp' })
    expired: Date
}

const databaseConnection = new DataSource({
    type: 'mysql',
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
    synchronize: DEV_ENVIRONMENT,
    entities: [User, Exchange],
});

export const addUser = async (
    email: string, password: string, username: string
): Promise<User> => {
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = await encryptPassword(password);
    return await User.create(user).save();
}

export const getUser = async (
    email: string, password: string
): Promise<User | null> => {
    const user = await checkUser(email);
    if (!user) return null;
    const isMatch = await verifyPassword(password, user.password);
    return isMatch ? user : null;
}

export const checkUser = async (email: string): Promise<User | null> => {
    return await User.findOneBy({ email });
}

export const generateExchange = async (email: string): Promise<string> => {
    const exchange = new Exchange();
    exchange.email = email;
    exchange.code = randomInt(9999_9999).toString().padStart(8, '0');
    exchange.expired = new Date(Date.now() + EXCHANGE_DURATION * 1000);
    await Exchange.create(exchange).save();
    return exchange.code;
}

export const getExchange = async (code: string): Promise<Exchange | null> => {
    return await Exchange.findOneBy({ code, expired: LessThan(new Date()) });
}

export const setupDatabase = async (): Promise<void> => {
    await databaseConnection.initialize();
    setInterval(() => {
        Exchange.delete({ expired: MoreThan(new Date()) })
        .catch((error: any) => console.log('Error occurs during cleanup', error));
    }, 60 * 60 * 1000)
    // if (isMainThread) {
    //     const resolvedPath = require.resolve(__filename);
    //     const worker = new Worker(resolvedPath, {
    //         execArgv: (
    //             /\.ts$/.test(resolvedPath) 
    //             ? ['-r', 'ts-node/register'] 
    //             : undefined
    //         ),
    //     });
    //     worker.on('error', (error) => {
    //         console.error('Worker error:', error);
    //     });
    //     worker.on('exit', (code) => {
    //         if (code !== 0) {
    //             console.error(`Worker stopped with exit code ${code}`);
    //         }
    //     });
    // }
}

// if(!isMainThread) {
//     // Do something in background
// }