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
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminService } from "../services/admin.service";
import { CreateAdminDto, UpdateAdminDto } from "../dto/admin.dto";
import { IsAdminGuard } from "../guards/admin.guard";
import { LogInGuard } from "../guards/user.guards";


@ApiBearerAuth()
@ApiTags('users', 'admin')
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
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(LogInGuard, IsAdminGuard)
    fetchAdmin(@Param('id') id: number) {
        return this.adminService.fetchOne(id);
    }

    @Post()
    @ApiTags('auth')
    @UseGuards(LogInGuard, IsAdminGuard)
    createAdmin(@Body() dto: CreateAdminDto) {
        return this.adminService.create(dto);
    }

    @Patch('/:id')
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(LogInGuard, IsAdminGuard)
    updateAdmin(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
        return this.adminService.update(id, dto);
    }

    @Delete('/:id')
    @ApiParam({ name: 'id', type: 'number' })
    @UseGuards(LogInGuard, IsAdminGuard)
    deleteAdmin(@Param('id') id: number) {
        return this.adminService.delete(id);
    }
}
