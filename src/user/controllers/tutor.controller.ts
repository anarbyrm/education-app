import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    Query, 
    UploadedFile, 
    UseGuards, 
    UseInterceptors
} from "@nestjs/common";
import { TutorService } from "../services/tutor.service";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { IUserFilterQuery } from "../interfaces/user.interface";
import { FileInterceptor } from "@nestjs/platform-express";
import { createMulterOptions } from "../../utils/multer";
import { OptionType } from "../interfaces/student.interface";
import { IsAdminOrOwnsEntityGuard, LogInGuard } from "../guards/user.guards";


@Controller('/users/tutors')
export class TutorController {
    constructor(private tutorService: TutorService) {}

    @Get()
    fetchAll(
        @Query() query: IUserFilterQuery,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('offset', new ParseIntPipe({ optional: true })) offset: number
    ) {
        return this.tutorService.findAll(query, limit, offset);
    }

    @Get('/:id')
    fetchOne(@Param('id', ParseIntPipe) id: number) {
        return this.tutorService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.tutorService.create(dto);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.tutorService.delete(id);
    }

    @Patch('/:id')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    updateInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto
    ) {
        return this.tutorService.update(id, dto);
    }

    @Patch('/:id/avatar')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    @UseInterceptors(FileInterceptor('image', createMulterOptions(OptionType.AVATAR)))
    updatePhoto(
        @Query('id', ParseIntPipe) id: number,
        @UploadedFile() imageFile: Express.Multer.File
    ) {
        return this.tutorService.updatePhoto(id, imageFile);
    }

    @Delete('/:id/avatar')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    removePhoto(@Query('id', ParseIntPipe) id: number) {
        return this.tutorService.removePhoto(id);
    }

    @Patch('/:id/unfreeze')
    @UseGuards(LogInGuard, IsAdminOrOwnsEntityGuard)
    unfreezeTutor(@Param('id', ParseIntPipe) id: number) {
        return this.tutorService.unfreeze(id);
    }
}
