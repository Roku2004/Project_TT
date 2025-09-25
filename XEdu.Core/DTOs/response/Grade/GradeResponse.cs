namespace XEdu.Core.DTOs.response.Grade;

public class GradeResponse
{
    public long id { get; set; }
    public string name { get; set; } = string.Empty;
    public string? description { get; set; }
    public int gradeLevel { get; set; }
    public bool active { get; set; } = true;
}