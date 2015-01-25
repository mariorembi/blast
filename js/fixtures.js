/**
 * Definicje symboli słownika sekwencji DNA
 * @type {{id: string, symbol: string}[]}
 */
Blast.SequenceSymbol.FIXTURES = [
    {
        id: '1',
        symbol: 'A'
    },
    {
        id: '2',
        symbol: 'T'
    },
    {
        id: '3',
        symbol: 'G'
    },
    {
        id: '4',
        symbol: 'C'
    }
];

Blast.QuerySequence.FIXTURES = [
    {
        id: '1',
        sequence: 'AAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTAT'
    }
];

Blast.Word.FIXTURES = [];
/**
 * Definicje rekordów "bazy danych"
 * @type {{id: string, sequence: string}[]}
 */
Blast.SequenceRecord.FIXTURES = [
    {
        id: '1',
        sequence: 'ATTGATTTAGTATATTATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT',
        description: 'Sanity test, original sequence query was taken from verbatim.'
    },
    {
        id: '2',
        sequence: 'ATTGATTTAGTATATGATTAAATGTATATATTAATTCAATATTATTATTCTATTCATTTTTATTCATTTT',
        description: 'Single change.'
    },
    {
        id: '3',
        sequence: 'ATTGATTTAGTATATTGTTAAATGTATATATTAATTCAATTTTATTATTCTATTCATTTTTATTCATTTT',
        description: 'Two changes.'
    },
    {
        id: '4',
        sequence: 'ATTGATTTAGTTTATTATTAAAGGTATATATTAATTCAATATTATTATTCTATTCATTTTTTTTCATTTT',
        description: 'Three changes.'
    },
    {
        id: '5',
        sequence: 'AATGATTTAGTTTATTATTAAAGGTATATATTAATTCAATATTATTATTCTATTCATTTTTTTTCATTTT',
        description: 'Four changes.'
    },
    {
        id: '6',
        sequence: 'CAAGAAGCGATGGGAACGATGTAATCCATGAATACAGAAGATTCAATTGAAAAAGATCCTAATGATTCAT',
        description: 'Partial Opuntia DNA sequence #1'
    },
    {
        id: '7',
        sequence: 'TTCATATTCAATTAAAATTGAAATTTTTTCATTCGCGAGGAGCCGGATGAGAAGAAACTCTCATGTCCGG',
        description: 'Partial Opuntia DNA sequence #2'
    },
    {
        id: '8',
        sequence: 'CAAATTTATAATATATTAATCTATATATTAATTTAGAATTCTATTCTAATTCGAATTCAATTTTTAAATA',
        description: 'Partial Opuntia DNA sequence #3'
    }
];

Blast.MatchedRecord.FIXTURES = [];

Blast.WordRecordGroup.FIXTURES = [];
/**
 * Definicje kar i nagród dla dopasowań symboli słownika sekwencji
 * @type {{id: string, fromSymbol: string, toSymbol: string, score: number}[]}
 */
Blast.Scoring.FIXTURES = [
    {
        id: '1',
        fromSymbol: '1',
        toSymbol: '1',
        score: 1
    },
    {
        id: '2',
        fromSymbol: '1',
        toSymbol: '2',
        score: -1
    },
    {
        id: '3',
        fromSymbol: '1',
        toSymbol: '3',
        score: -1
    },
    {
        id: '4',
        fromSymbol: '1',
        toSymbol: '4',
        score: -1
    },
    {
        id: '5',
        fromSymbol: '2',
        toSymbol: '1',
        score: -1
    },
    {
        id: '6',
        fromSymbol: '2',
        toSymbol: '2',
        score: 1
    },
    {
        id: '7',
        fromSymbol: '2',
        toSymbol: '3',
        score: -1
    },
    {
        id: '8',
        fromSymbol: '2',
        toSymbol: '4',
        score: -1
    },
    {
        id: '9',
        fromSymbol: '3',
        toSymbol: '1',
        score: -1
    },
    {
        id: '10',
        fromSymbol: '3',
        toSymbol: '2',
        score: -1
    },
    {
        id: '11',
        fromSymbol: '3',
        toSymbol: '3',
        score: 1
    },
    {
        id: '12',
        fromSymbol: '3',
        toSymbol: '4',
        score: -1
    },
    {
        id: '13',
        fromSymbol: '4',
        toSymbol: '1',
        score: -1
    },
    {
        id: '14',
        fromSymbol: '4',
        toSymbol: '2',
        score: -1
    },
    {
        id: '15',
        fromSymbol: '4',
        toSymbol: '3',
        score: -1
    },
    {
        id: '16',
        fromSymbol: '4',
        toSymbol: '4',
        score: 1
    }
];

//empty array is required
Blast.Result.FIXTURES = [];