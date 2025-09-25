using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("classrooms")]
public class Classroom
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    [Column("description")]
    public string? Description { get; set; }

    [Required]
    [MaxLength(20)]
    [Column("class_code")]
    public string ClassCode { get; set; } = string.Empty;

    [Required]
    [Column("teacher_id")]
    public long TeacherId { get; set; }

    [Column("grade_id")]
    public long? GradeId { get; set; }

    [Column("subject_id")]
    public long? SubjectId { get; set; }

    [Required]
    [Column("active")]
    public bool Active { get; set; } = true;

    [Column("max_students")]
    public int? MaxStudents { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(TeacherId))]
    public virtual User Teacher { get; set; } = null!;

    [ForeignKey(nameof(GradeId))]
    public virtual Grade? Grade { get; set; }

    [ForeignKey(nameof(SubjectId))]
    public virtual Subject? Subject { get; set; }

    public virtual ICollection<ClassroomStudent> ClassroomStudents { get; set; } = new List<ClassroomStudent>();
    public virtual ICollection<ClassroomCourse> ClassroomCourses { get; set; } = new List<ClassroomCourse>();
    public virtual ICollection<ClassroomExam> ClassroomExams { get; set; } = new List<ClassroomExam>();
}