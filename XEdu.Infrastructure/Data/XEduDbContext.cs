using Microsoft.EntityFrameworkCore;
using XEdu.Core.Entities;
using XEdu.Core.Enums;

namespace XEdu.Infrastructure.Data;

public class XEduDbContext : DbContext
{
    public XEduDbContext(DbContextOptions<XEduDbContext> options) : base(options)
    {
    }

    // DbSets for all entities
    public DbSet<User> Users { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Grade> Grades { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<Classroom> Classrooms { get; set; }
    public DbSet<CourseEnrollment> CourseEnrollments { get; set; }
    public DbSet<ClassroomStudent> ClassroomStudents { get; set; }
    public DbSet<ClassroomCourse> ClassroomCourses { get; set; }
    public DbSet<Exam> Exams { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Answer> Answers { get; set; }
    public DbSet<ExamQuestion> ExamQuestions { get; set; }
    public DbSet<StudentExam> StudentExams { get; set; }
    public DbSet<StudentAnswer> StudentAnswers { get; set; }
    public DbSet<ClassroomExam> ClassroomExams { get; set; }
    public DbSet<EnrollmentLesson> EnrollmentLessons { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure User entity
        builder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasIndex(e => e.Email).IsUnique();
            
            // Configure column mappings
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Email).HasColumnName("email").IsRequired().HasMaxLength(255);
            entity.Property(e => e.Password).HasColumnName("password").IsRequired().HasMaxLength(255);
            entity.Property(e => e.FullName).HasColumnName("full_name").HasMaxLength(255).IsRequired(false);
            entity.Property(e => e.Role).HasColumnName("role").HasConversion<string>().IsRequired();
            entity.Property(e => e.Provider).HasColumnName("provider").HasConversion<string>().IsRequired();
            entity.Property(e => e.ProviderId).HasColumnName("provider_id").HasMaxLength(255).IsRequired(false);
            entity.Property(e => e.Avatar).HasColumnName("avatar").HasMaxLength(500).IsRequired(false);
            entity.Property(e => e.Phone).HasColumnName("phone").HasMaxLength(20).IsRequired(false);
            entity.Property(e => e.EmailVerified).HasColumnName("email_verified").IsRequired();
            entity.Property(e => e.Active).HasColumnName("active").IsRequired();
            entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();
            entity.Property(e => e.LastLogin).HasColumnName("last_login").IsRequired(false);
        
            // Configure relationships
            entity.HasMany(u => u.CoursesTeaching)
                  .WithOne(c => c.Teacher)
                  .HasForeignKey(c => c.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);
        
            entity.HasMany(u => u.ClassroomsTeaching)
                  .WithOne(c => c.Teacher)
                  .HasForeignKey(c => c.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);
        
            entity.HasMany(u => u.ExamsCreated)
                  .WithOne(e => e.Teacher)
                  .HasForeignKey(e => e.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);
        
            entity.HasMany(u => u.QuestionsCreated)
                  .WithOne(q => q.Teacher)
                  .HasForeignKey(q => q.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Subject entity
        builder.Entity<Subject>(entity =>
        {
            entity.HasMany(s => s.Topics)
                  .WithOne(t => t.Subject)
                  .HasForeignKey(t => t.SubjectId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Course entity
        builder.Entity<Course>(entity =>
        {
            entity.Property(c => c.Level).HasConversion<string>();
            entity.Property(c => c.Status).HasConversion<string>();
            
            entity.HasMany(c => c.Chapters)
                  .WithOne(l => l.Course)
                  .HasForeignKey(l => l.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<Chapter>(entity =>
        {
            entity.Property(e => e.Status)
                .HasConversion(
                    v => v.ToString(),           // Enum to string
                    v => Enum.Parse<ChapterStatus>(v)); // String to enum
        });

        // Configure Lesson entity
        builder.Entity<Lesson>(entity =>
        {
            entity.Property(l => l.Type).HasConversion<string>();
        });

        // Configure Exam entity
        builder.Entity<Exam>(entity =>
        {
            entity.Property(e => e.TeacherId).IsRequired(false);
            entity.Property(e => e.TopicId).IsRequired(false);
            entity.Property(e => e.CourseId).IsRequired(false);
            entity.Property(e => e.SubjectId).IsRequired(false);
            entity.Property(e => e.GradeId).IsRequired(false);
        });

        // Configure Question entity
        builder.Entity<Question>(entity =>
        {
            entity.Property(q => q.Type).HasConversion<string>();
            entity.Property(q => q.Difficulty).HasConversion<string>();
            
            entity.HasMany(q => q.Answers)
                  .WithOne(a => a.Question)
                  .HasForeignKey(a => a.QuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure StudentExam entity
        builder.Entity<StudentExam>(entity =>
        {
            entity.Property(se => se.Status).HasConversion<string>();
            
            entity.HasMany(se => se.StudentAnswers)
                  .WithOne(sa => sa.StudentExam)
                  .HasForeignKey(sa => sa.StudentExamId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure CourseEnrollment entity
        builder.Entity<CourseEnrollment>(entity =>
        {
            entity.Property(ce => ce.Type).HasConversion<string>();
            entity.Property(ce => ce.Status).HasConversion<string>();
        });

        // Configure unique constraints and indexes
        builder.Entity<Classroom>()
               .HasIndex(c => c.ClassCode)
               .IsUnique();

        builder.Entity<ClassroomStudent>()
               .HasIndex(cs => new { cs.ClassroomId, cs.StudentId })
               .IsUnique();

        builder.Entity<CourseEnrollment>()
               .HasIndex(ce => new { ce.StudentId, ce.CourseId })
               .IsUnique();

        builder.Entity<ExamQuestion>()
               .HasIndex(eq => new { eq.ExamId, eq.QuestionId })
               .IsUnique();

    }
}