namespace XEdu.Core.Entities;

public class PagedResult<T>
{
    public IEnumerable<T> Content { get; set; }
    public int TotalElements { get; set; }
    public int Page { get; set; }
    public int Size { get; set; }
    public int TotalPages
    {
        get => (int)Math.Ceiling((double)TotalElements / Size);
        init => throw new NotImplementedException();
    }

    public bool Last
    {
        get => Page + 1 >= TotalPages;
        init => throw new NotImplementedException();
    }

    public bool First
    {
        get => Page == 0;
        init => throw new NotImplementedException();
    }
}
