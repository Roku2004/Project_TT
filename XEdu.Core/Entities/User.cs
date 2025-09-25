using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }
    
    [Required]
    [MaxLength(255)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    [Column("password")]
    [MaxLength(255)]
    public string Password { get; set; } = string.Empty;
    
    [Column("full_name")]
    [MaxLength(255)]
    public string? FullName { get; set; }  // Đã nullable - OK

    [Required]
    [Column("role", TypeName = "varchar(20)")]
    public Role Role { get; set; } = Role.STUDENT;

    [Column("provider")]
    public AuthProvider Provider { get; set; } = AuthProvider.LOCAL;

    [MaxLength(255)]
    [Column("provider_id")]
    public string? ProviderId { get; set; }  // Đã nullable - OK

    [MaxLength(500)]
    [Column("avatar")]
    public string? Avatar { get; set; }  // Đã nullable - OK

    [MaxLength(20)]
    [Column("phone")]
    public string? Phone { get; set; }  // Đã nullable - OK

    [Required]
    [Column("email_verified")]
    public bool EmailVerified { get; set; } = false;

    [Required]
    [Column("active")]
    public bool Active { get; set; } = true;

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("last_login")]
    public DateTime? LastLogin { get; set; }  // Đã nullable - OK

    // Navigation properties
    public virtual ICollection<Course> CoursesTeaching { get; set; } = new List<Course>();
    public virtual ICollection<Classroom> ClassroomsTeaching { get; set; } = new List<Classroom>();
    public virtual ICollection<Exam> ExamsCreated { get; set; } = new List<Exam>();
    public virtual ICollection<Question> QuestionsCreated { get; set; } = new List<Question>();
    public virtual ICollection<CourseEnrollment> CourseEnrollments { get; set; } = new List<CourseEnrollment>();
    public virtual ICollection<ClassroomStudent> ClassroomStudents { get; set; } = new List<ClassroomStudent>();
    public virtual ICollection<StudentExam> StudentExams { get; set; } = new List<StudentExam>();
}