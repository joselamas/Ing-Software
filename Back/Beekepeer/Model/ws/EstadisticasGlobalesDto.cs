﻿using Beekepeer.Model.ws;
using Beekepeer.Model.ws.stadistica;

public class EstadisticasGlobalesDto
{
    public EstadisticasGlobalesDto()
    {
        Roi = new RoiDto();
        ProduccionTotal = new ProduccionTotalDto();
        GastoTotal = new GastoTotalDto();
        ComparativaMeses = new List<ComparativaMesDto>();
        RankingElite = new List<RankingEliteDto>();
    }

    public RoiDto Roi { get; set; }
    public ProduccionTotalDto ProduccionTotal { get; set; }
    public GastoTotalDto GastoTotal { get; set; }
    public List<ComparativaMesDto> ComparativaMeses { get; set; }
    public List<RankingEliteDto> RankingElite { get; set; }
}
