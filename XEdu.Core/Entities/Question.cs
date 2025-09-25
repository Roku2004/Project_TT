using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XEdu.Core.Enums;

namespace XEdu.Core.Entities;

[Table("questions")]
public class Question
{
    [Key]
    [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [MaxLength(1000)]
    [Column("question_text")]
    public string QuestionText { get; set; } = string.Empty;

    [Required]
    [Column("type")]
    public QuestionType Type { get; set; } = QuestionType.MULTIPLE_CHOICE;

    [Required]
    [Column("points",TypeName = "decimal(4,2)")]
    public decimal Points { get; set; } = 1.0m;

    [Required]
    [Column("difficulty")]
    public DifficultyLevel Difficulty { get; set; } = DifficultyLevel.MEDIUM;

    [MaxLength(1000)]
    [Column("explanation")]
    public string? Explanation { get; set; }

    [MaxLength(500)]
    [Column("image_url")]
    public string? ImageUrl { get; set; }

    [Required]
    [Column("teacher_id")]
    public long TeacherId { get; set; }

    [Required]
    [Column("subject_id")]
    public long SubjectId { get; set; }

    [Column("topic_id")]
    public long? TopicId { get; set; }

    [Required]
    [Column("active")]
    public bool Active { get; set; } = true;

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

    [ForeignKey(nameof(TopicId))]
    public virtual Topic? Topic { get; set; }

    public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    public virtual ICollection<ExamQuestion> ExamQuestions { get; set; } = new List<ExamQuestion>();
    public virtual ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
}