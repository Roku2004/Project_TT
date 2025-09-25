using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("course_enrollments")]
public class CourseEnrollment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("student_id")]
    public long StudentId { get; set; }

    [Required]
    [Column("course_id")]
    public long CourseId { get; set; }

    [Required]
    [Column("enrollment_type")]
    public EnrollmentType Type { get; set; } = EnrollmentType. SELF_ENROLLED;

    [Column("paid_amount",TypeName = "decimal(10,2)")]
    public decimal? PaidAmount { get; set; }

    [Column("status")]
    public EnrollmentStatus? Status { get; set; } = EnrollmentStatus.ACTIVE;
    
    [Column("progress_percentage",TypeName = "decimal(5,2)")]
    public decimal Progress { get; set; } = 0;
    
    [Column("completed_at")]
    public DateTime? CompletedAt { get; set; }

    [Required]
    [Column("enrolled_at")]
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("lessons_completed")] 
    public int LessonsCompleted { get; set; } = 0;

    // Navigation properties
    [ForeignKey(nameof(StudentId))]
    public virtual User Student { get; set; } = null!;

    [ForeignKey(nameof(CourseId))]
    public virtual Course Course { get; set; } = null!;
}