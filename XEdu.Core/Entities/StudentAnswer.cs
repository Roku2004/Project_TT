using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("student_answers")]
public class StudentAnswer
{
    [Key]
    [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [Column("student_exam_id")]
    public long StudentExamId { get; set; }

    [Required]
    [Column("question_id")]
    public long QuestionId { get; set; }

    [Column("selected_answer_id")]
    public long? selectedAnswer { get; set; } // For multiple choice questions

    [MaxLength(1000)]
    [Column("text_answer")]
    public string? TextAnswer { get; set; } = String.Empty;

    [Column("earned_points",TypeName = "decimal(4,2)")]
    public decimal? PointsEarned { get; set; } = 0;
    
    [Required]
    [Column("created_at")]
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;

    [Column("feedback")]
    [MaxLength(500)]
    public string? Feedback { get; set; }
    
    
    // Navigation properties
    [ForeignKey(nameof(StudentExamId))]
    public virtual StudentExam StudentExam { get; set; } = null!;

    [ForeignKey(nameof(QuestionId))]
    public virtual Question Question { get; set; } = null!;

    [ForeignKey(nameof(selectedAnswer))]
    public virtual Answer? Answer { get; set; }
}