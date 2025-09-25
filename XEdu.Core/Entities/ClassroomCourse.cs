using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("classroom_courses")]
public class ClassroomCourse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("classroom_id")]
    public long ClassroomId { get; set; }

    [Required]
    [Column("course_id")]
    public long CourseId { get; set; }

    [Required]
    [Column("assigned_at")]
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("active")]
    public bool Active { get; set; } = true;

    [Required]
    [Column("start_date")]
    public DateTime StartDate { get; set; }
    
    [Column("end_date")]
    public DateTime? EndDate { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(ClassroomId))]
    public virtual Classroom Classroom { get; set; } = null!;

    [ForeignKey(nameof(CourseId))]
    public virtual Course Course { get; set; } = null!;
}