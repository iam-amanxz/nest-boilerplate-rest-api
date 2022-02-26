import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { LoginDto, RegisterDto } from '../src/auth/dto';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(4000);

    prisma = app.get(PrismaService);
    await prisma.cleanDatabase();
    pactum.request.setBaseUrl('http://localhost:4000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const loginDto: LoginDto = {
      email: 'user1@mail.com',
      password: '123',
    };
    const registerDto: RegisterDto = {
      email: 'user1@mail.com',
      password: '123',
      name: 'John',
    };

    describe('Register', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            password: registerDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            email: registerDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/register').expectStatus(400);
      });
      it('should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(registerDto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: loginDto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: loginDto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(loginDto)
          .expectStatus(200)
          .stores('accessToken', 'accessToken')
          .stores('refreshToken', 'refreshToken');
      });
    });

    describe('Refresh', () => {
      it('should throw if authorization header not provided', () => {
        return pactum.spec().post('/auth/refresh').expectStatus(401);
      });
      it('should throw if wrong refresh token provided', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(401);
      });
      it('should refresh', () => {
        return pactum
          .spec()
          .post('/auth/refresh')
          .withHeaders({
            Authorization: 'Bearer $S{refreshToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Logout', () => {
      it('should throw if authorization header not provided', () => {
        return pactum.spec().post('/auth/logout').expectStatus(401);
      });
      it('should throw if wrong access token provided', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer $S{refreshToken}',
          })
          .expectStatus(401);
      });
      it('should logout', () => {
        return pactum
          .spec()
          .post('/auth/logout')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Users', () => {
    describe('Get details', () => {
      it('should throw if authorization header not provided', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('should return user details', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('Update user details', () => {
      it('should throw if authorization header not provided', () => {
        return pactum.spec().patch('/users/me').expectStatus(401);
      });
      it('should return user details', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .withBody({
            name: 'Mary',
          })
          .expectStatus(200);
      });
    });

    describe('Delete user', () => {
      it('should delete user', () => {
        return pactum
          .spec()
          .delete('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{accessToken}',
          })
          .expectStatus(204);
      });
    });
  });
});
