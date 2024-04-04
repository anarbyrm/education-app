import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Patch, 
    Post, 
    UseGuards
} from "@nestjs/common";
import { AdminService } from "../services/admin.service";
import { UserTokenDto } from "../dto/user.dto";
import { CreateAdminDto, UpdateAdminDto } from "../dto/admin.dto";
import { IsAdminGuard } from "../guards/admin.guard";

@Controller('/admins')
@UseGuards(IsAdminGuard)
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

    @Post('/auth/token')
    async login(@Body() dto: UserTokenDto) {
        const token = await this.adminService.createToken(dto);
        return { token };
    }

    @Patch('/:id')
    updateAdmin(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
        return this.adminService.update(id, dto);
    }

    @Delete('/:id')
    deleteAdmin(@Param('id') id: number) {
        return this.adminService.delete(id);
    }
}