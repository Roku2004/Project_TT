using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("courses")]
public class Course
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(255)]
    [Column("title")]
    public string? Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    [Column("description")]
    public string? Description { get; set; }

    [MaxLength(2000)]
    [Column("objectives")]
    public string? Objectives { get; set; }

    [MaxLength(500)]
    [Column("thumbnail")]
    public string? Thumbnail { get; set; }

    [Column("price",TypeName = "decimal(10,2)")]
    public decimal Price { get; set; } = 0;

    [Required]
    [Column("is_free")]
    public bool IsFree { get; set; } = true;

    [Required]
    [Column("level")]
    public CourseLevel Level { get; set; } = CourseLevel.BEGINNER;
    
    [Column("estimated_duration")]
    public int? EstimatedDuration { get; set; }

    [Required]
    [Column("teacher_id")]
    public long TeacherId { get; set; }

    [Required]
    [Column("subject_id")]
    public long SubjectId { get; set; }

    [Required]
    [Column("grade_id")]
    public long GradeId { get; set; }

    [Column("topic_id")]
    public long? TopicId { get; set; }

    [Required]
    [Column("status")]
    public CourseStatus Status { get; set; } = CourseStatus.DRAFT;

    [Required]
    [Column("published")]
    public bool Published { get; set; } = false;

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(TeacherId))]
    public virtual User Teacher { get; set; } = null!;

    [ForeignKey(nameof(SubjectId))]
    public virtual Subject Subject { get; set; } = null!;

    [ForeignKey(nameof(GradeId))]
    public virtual Grade Grade { get; set; } = null!;

    [ForeignKey(nameof(TopicId))]
    public virtual Topic? Topic { get; set; }

    public virtual ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
    public virtual ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();
    public virtual ICollection<ClassroomCourse> ClassroomCourses { get; set; } = new List<ClassroomCourse>();
    public virtual ICollection<Exam> Exams { get; set; } = new List<Exam>();
}