using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("classroom_exams")]
public class ClassroomExam
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("classroom_id")]
    public long ClassroomId { get; set; }

    [Required]
    [Column("exam_id")]
    public long ExamId { get; set; }

    [Required]
    [Column("assigned_at")]
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("active")]
    public bool Active { get; set; } = true;
    
    [Column("available_from")]
    public DateTime? AvailableFrom { get; set; }
    
    [Column("available_until")]
    public DateTime? AvailableUntil { get; set; }

    // Navigation properties
    [ForeignKey(nameof(ClassroomId))]
    public virtual Classroom Classroom { get; set; } = null!;

    [ForeignKey(nameof(ExamId))]
    public virtual Exam Exam { get; set; } = null!;
}