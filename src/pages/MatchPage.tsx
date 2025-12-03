import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Home, Clock, Heart, ArrowRight, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Button from "@/components/Button";
import { matchApi, MatchResponse, Animal } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const temperamentoOptions = [
  { value: "1", label: "Calmo", description: "Prefere um pet tranquilo e relaxado" },
  { value: "2", label: "Ativo", description: "Gosta de brincadeiras e atividades" },
  { value: "3", label: "Tímido", description: "Busca um companheiro mais reservado" },
  { value: "4", label: "Sociável", description: "Adora interação e novos amigos" },
];

const MatchPage = () => {
  const { toast } = useToast();
  const [espacoEmCasa, setEspacoEmCasa] = useState<number>(50);
  const [tempoDisponivel, setTempoDisponivel] = useState<number>(2);
  const [preferenciaTemperamento, setPreferenciaTemperamento] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await matchApi.findMatch({
        espacoEmCasa,
        tempoDisponivel,
        preferenciaTemperamento: parseInt(preferenciaTemperamento),
      });
      
      if (response.success) {
        setResult(response);
      } else {
        setError("Não foi possível encontrar um match. Tente novamente.");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao conectar com o servidor. Verifique se o backend está rodando.";
      setError(message);
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Powered by AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Encontre seu Match Perfeito
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossa inteligência artificial vai analisar seu perfil e encontrar o pet ideal para você.
            Responda algumas perguntas e deixe a magia acontecer!
          </p>
        </div>

        {!result ? (
          <Card className="max-w-2xl mx-auto shadow-xl border-2">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-accent" />
                Conte-nos sobre você
              </CardTitle>
              <CardDescription>
                Preencha os campos abaixo para encontrarmos o pet perfeito
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Espaço em Casa */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    <Label className="text-base font-semibold">Espaço em Casa</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantos metros quadrados tem sua casa/apartamento?
                  </p>
                  <div className="pt-2">
                    <Slider
                      value={[espacoEmCasa]}
                      onValueChange={(value) => setEspacoEmCasa(value[0])}
                      min={20}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>20m²</span>
                      <span className="font-semibold text-primary text-lg">{espacoEmCasa}m²</span>
                      <span>300m²</span>
                    </div>
                  </div>
                </div>

                {/* Tempo Disponível */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-secondary" />
                    <Label className="text-base font-semibold">Tempo Disponível</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantas horas por dia você pode dedicar ao pet?
                  </p>
                  <div className="pt-2">
                    <Slider
                      value={[tempoDisponivel]}
                      onValueChange={(value) => setTempoDisponivel(value[0])}
                      min={1}
                      max={8}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>1h</span>
                      <span className="font-semibold text-secondary text-lg">{tempoDisponivel}h/dia</span>
                      <span>8h</span>
                    </div>
                  </div>
                </div>

                {/* Preferência de Temperamento */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-accent" />
                    <Label className="text-base font-semibold">Preferência de Temperamento</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Que tipo de personalidade você prefere em um pet?
                  </p>
                  <RadioGroup
                    value={preferenciaTemperamento}
                    onValueChange={setPreferenciaTemperamento}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2"
                  >
                    {temperamentoOptions.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem
                          value={option.value}
                          id={`temp-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`temp-${option.value}`}
                          className="flex flex-col items-start p-4 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
                        >
                          <span className="font-semibold">{option.label}</span>
                          <span className="text-sm text-muted-foreground">{option.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full text-lg py-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Encontrar Meu Match
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <MatchResult result={result} onReset={resetForm} />
        )}
      </div>
    </div>
  );
};

interface MatchResultProps {
  result: MatchResponse;
  onReset: () => void;
}

const MatchResult = ({ result, onReset }: MatchResultProps) => {
  const { animal, matchScore, iaReasoning } = result;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Match Score Card */}
      <Card className="shadow-xl border-2 border-primary/20 overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Match Encontrado!</h2>
          <p className="opacity-90">A IA encontrou o pet perfeito para você</p>
        </div>
        <CardContent className="pt-8">
          {/* Circular Progress */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(matchScore / 100) * 440} 440`}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-4xl font-bold text-primary">{matchScore}%</span>
                <span className="text-sm text-muted-foreground">Compatibilidade</span>
              </div>
            </div>
          </div>

          {/* Linear Progress Alternative */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compatibilidade</span>
              <span className="font-semibold text-primary">{matchScore}%</span>
            </div>
            <Progress value={matchScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Animal Card */}
      <Card className="shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square md:aspect-auto">
            <img
              src={animal.imagemUrl || animal.fotos?.[0] || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"}
              alt={animal.nome}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-foreground mb-2">{animal.nome}</h3>
            <p className="text-muted-foreground mb-4">{animal.raca} • {animal.idade} • {animal.porte}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {animal.temperamento?.map((trait, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>

            <Link to={`/animal/${animal.id}`}>
              <Button variant="primary" className="w-full">
                Ver Perfil Completo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* IA Reasoning Card */}
      <Card className="shadow-xl border-2 border-accent/20">
        <CardHeader className="bg-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Análise da IA
          </CardTitle>
          <CardDescription>
            Veja por que este pet é ideal para você
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {iaReasoning}
          </p>
        </CardContent>
      </Card>

      {/* Reset Button */}
      <div className="text-center">
        <Button variant="outline" onClick={onReset} className="px-8">
          Fazer Novo Match
        </Button>
      </div>
    </div>
  );
};

export default MatchPage;
