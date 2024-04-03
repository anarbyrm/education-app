import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post 
} from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { UserTokenDto } from "../dto/user.dto";
import { CreateAdminDto } from "../dto/admin.dto";

@Controller('/admins')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Get()
    fetchAllAdmins() {
        return this.adminService.fetchAll();
    }

    @Get('/:id')
    fetchAdmin(@Param('id') id: number) {
        return this.adminService.fetchOne(id);
    }

    @Post()
    createAdmin(@Body() dto: CreateAdminDto) {
        return this.adminService.create(dto);
    }

    @Post()
    login(@Body() dto: UserTokenDto) {
        return this.adminService.createToken();
    }

    @Patch('/:id')
    updateAdmin(@Param('id') id: number) {
        return this.adminService.update(id);
    }

    @Delete('/:id')
    deleteAdmin(@Param('id') id: number) {
        return this.adminService.delete(id);
    }
}