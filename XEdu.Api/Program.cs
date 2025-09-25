using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using XEdu.Api.Config;
using XEdu.Api.Security;
using XEdu.Core.IService;
using XEdu.Core.Services;
using XEdu.Infrastructure.Data;
using XEdu.Infrastructure.Repositories;
using XEdu.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký AutoMapper và chỉ định Profile
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Server=14.162.146.23:3307;Database=xedu;User=xedu;Password=xedu@2025;";

builder.Services.AddDbContext<XEduDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.Parse("8.0.41-mysql")));

// Custom Password Hasher - đăng ký cả interface và concrete type
builder.Services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
builder.Services.AddScoped<BCryptPasswordHasher>(); // Thêm dòng này

// JWT Configuration
var jwtSecret = builder.Configuration["Jwt:Secret"] ??
                "myVerySecureSecretKeyThatIs256BitsLongForJWTTokenGenerationAndShouldBeAtLeast32Characters";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

// CORS Configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Repository Registration
builder.Services.AddScoped<UserRepository>();

builder.Services.AddScoped<CourseRepository>();

builder.Services.AddScoped<SubjectRepository>();

builder.Services.AddScoped<ClassroomRepository>();

builder.Services.AddScoped<GradeRepository>();

builder.Services.AddScoped<LessonRepository>();

builder.Services.AddScoped<ExamRepository>();

builder.Services.AddScoped<ClassStudentRepository>();

builder.Services.AddScoped<StudentExamRepository>();

builder.Services.AddScoped<ExamQuestionRepository>();

builder.Services.AddScoped<StudentAnswerRepository>();

builder.Services.AddScoped<AnswerRepository>();

builder.Services.AddScoped<ChapterRepository>();

builder.Services.AddScoped<CourseEnrollmentRepository>();

builder.Services.AddScoped<EnrollLessonRepository>();

// Service Registration
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<CourseService>();
builder.Services.AddScoped<ICourseService, CourseService>();

builder.Services.AddScoped<SubjectService>();
builder.Services.AddScoped<ISubjectService, SubjectService>();

builder.Services.AddScoped<ClassroomService>();
builder.Services.AddScoped<IClassroomService, ClassroomService>();

builder.Services.AddScoped<GradeService>();
builder.Services.AddScoped<IGradeService, GradeService>();

builder.Services.AddScoped<CourseService>();
builder.Services.AddScoped<ICourseService, CourseService>();

builder.Services.AddScoped<LessonService>();
builder.Services.AddScoped<ILessonService, LessonService>();

builder.Services.AddScoped<ExamService>();
builder.Services.AddScoped<IExamService, ExamService>();

builder.Services.AddScoped<ClassStudentService>();
builder.Services.AddScoped<IClassStudentService, ClassStudentService>();

builder.Services.AddScoped<StudentExamService>();
builder.Services.AddScoped<IStudentExamService, StudentExamService>();

builder.Services.AddScoped<ChapterService>();
builder.Services.AddScoped<IChapterService, ChapterService>();

builder.Services.AddScoped<CourseEnrollService>();
builder.Services.AddScoped<ICourseEnrollService, CourseEnrollService>();

builder.Services.AddScoped<EnrollLessonService>();
builder.Services.AddScoped<IEnrollLessonService, EnrollLessonService>();
// JWT Token Provider
builder.Services.AddScoped<JwtTokenProvider>(provider =>
    new JwtTokenProvider(provider.GetRequiredService<IConfiguration>()));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseMiddleware<JwtAuthenticationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();