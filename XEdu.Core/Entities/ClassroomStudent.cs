using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("classroom_students")]
public class ClassroomStudent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [Column("classroom_id")]
    public long ClassroomId { get; set; }

    [Required]
    [Column("student_id")]
    public long StudentId { get; set; }

    [Required]
    [Column("joined_at")]
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Column("active")]
    public bool Active { get; set; } = true;

    [Required]
    [Column("role", TypeName = "varchar(20)")]
    public ClassroomRole Role { get; set; } =  ClassroomRole.STUDENT; // Default role is '
    
    // Navigation properties
    [ForeignKey(nameof(ClassroomId))]
    public virtual Classroom Classroom { get; set; } = null!;

    [ForeignKey(nameof(StudentId))]
    public virtual User Student { get; set; } = null!;
}