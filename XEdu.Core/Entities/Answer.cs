using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XEdu.Core.Entities;

[Table("answers")]
public class Answer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(500)]
    [Column("answer_text")]
    public string AnswerText { get; set; } = string.Empty;

    [Required]
    [Column("is_correct")]
    public bool IsCorrect { get; set; } = false;

    [Required]
    [Column("order_index")]
    public int OrderIndex { get; set; } = 0;

    [Required]
    [Column("question_id")]
    public long QuestionId { get; set; }

    [Required]
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(QuestionId))]
    public virtual Question Question { get; set; } = null!;

    public virtual ICollection<StudentAnswer> StudentAnswers { get; set; } = new List<StudentAnswer>();
}