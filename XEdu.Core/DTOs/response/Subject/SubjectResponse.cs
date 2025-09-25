namespace XEdu.Core.DTOs.response.Subject;

public class SubjectResponse
{
    public long id { get; set; }
    public string name { get; set; } = string.Empty;
    public string? description { get; set; }
    public string? icon { get; set; }
    public bool active { get; set; } = true;
}
