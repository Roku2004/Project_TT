using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("enrollment_lessons")]
public class EnrollmentLesson
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }
    
    [Required]
    [Column("lesson_id")]
    public long LessonId { get; set; }
    
    [Required]
    [Column("course_enroll_id")]
    public long CourseEnrollmentId { get; set; }
    
    [Column("completed")]
    public bool Completed { get; set; } = false;
    
    [Column("completed_at")]
    public DateTime? CompletedAt { get; set; }
    
    [ForeignKey(nameof(LessonId))]
    public virtual Lesson Lesson { get; set; } = null!;
    
    [ForeignKey(nameof(CourseEnrollmentId))]
    public virtual CourseEnrollment CourseEnrollment { get; set; } = null!;
}