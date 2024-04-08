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
import { CreateAdminDto, UpdateAdminDto } from "../dto/admin.dto";
import { IsAdminGuard } from "../guards/admin.guard";
import { LogInGuard } from "../guards/user.guards";


@Controller('/users/admins')
@UseGuards(IsAdminGuard)
export class AdminController {
    constructor(private adminService: AdminService) {}

    @Get()
    @UseGuards(LogInGuard, IsAdminGuard)
    fetchAllAdmins() {
        return this.adminService.fetchAll();
    }

    @Get('/:id')
    @UseGuards(LogInGuard, IsAdminGuard)
    fetchAdmin(@Param('id') id: number) {
        return this.adminService.fetchOne(id);
    }

    @Post()
    @UseGuards(LogInGuard, IsAdminGuard)
    createAdmin(@Body() dto: CreateAdminDto) {
        return this.adminService.create(dto);
    }

    @Patch('/:id')
    @UseGuards(LogInGuard, IsAdminGuard)
    updateAdmin(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
        return this.adminService.update(id, dto);
    }

    @Delete('/:id')
    @UseGuards(LogInGuard, IsAdminGuard)
    deleteAdmin(@Param('id') id: number) {
        return this.adminService.delete(id);
    }
}
