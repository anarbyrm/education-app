import { Test, TestingModule } from "@nestjs/testing";
import { StudentController } from '../../controllers/student.controller'
import { StudentService } from "src/user/services/student.service";
import { CreateUserDto } from "src/user/dto/user.dto";


const studentTestReturnValue = {
    id: 1,
    email: "test@example.com",
    password: "test12345",
    firstName: "testName",
    lastName: "testLastName",
    bio: null,
    photo: null,
    isActive: true,
    isFrozen: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
}

describe('StudentController tests', () => {
    let controller: StudentController;
    let service: StudentService;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [StudentController],
            providers: [
                {
                    provide: StudentService,
                    useValue: {
                        fetchAll: jest.fn().mockResolvedValue([studentTestReturnValue]),
                        fetchOne: jest.fn().mockImplementation((id: number) => studentTestReturnValue),
                        create: jest.fn().mockImplementation((dto: CreateUserDto) => studentTestReturnValue)
                    }
                }
            ]
        }).compile();

        controller = moduleRef.get<StudentController>(StudentController);
        service = moduleRef.get<StudentService>(StudentService); 
    })

    it('should be defined', () => {
        expect(controller).toBeDefined();
    })

    test('"fetchStudents" method should return list of users', async () => {
        const students = await controller.fetchStudents();
        expect(students).toEqual([studentTestReturnValue]);
    })

    test('"fetchOneStudent" method should return one of users', async () => {
        const student = await controller.fetchOneStudent(1);
        expect(student).toEqual(student);
        expect(service.fetchOne).toHaveBeenCalledWith(1);
    })

    test('"createStudent" method should return one of users', async () => {
        const dto = {
            "email": "new-user@example.com",
            "password": "pass12345"
        }
        const newStudent = await controller.createStudent(dto);
        expect(newStudent).toEqual(newStudent);
        expect(service.create).toHaveBeenCalledWith(dto);
    })


})