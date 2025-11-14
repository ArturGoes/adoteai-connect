import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Heart, Home, Check } from "lucide-react";
import { mockAnimals } from "@/data/mockAnimals";
import Button from "@/components/Button";
import { useFavorites } from "@/contexts/FavoritesContext";

const AnimalProfilePage = () => {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const animal = mockAnimals.find((a) => a.id === Number(id));

  if (!animal) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark-text mb-4">
            Animal não encontrado
          </h1>
          <p className="text-gray-text mb-8">
            Desculpe, não conseguimos encontrar este animal.
          </p>
          <Link to="/">
            <Button variant="primary">Voltar para a página inicial</Button>
          </Link>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(animal.id);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
              <img
                src={animal.imagemUrl}
                alt={animal.nome}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Status Tag */}
            <div className="absolute top-4 left-4">
              {animal.disponivel ? (
                <div className="flex items-center gap-2 bg-success text-success-foreground px-4 py-2 rounded-full font-semibold shadow-lg">
                  <Check className="w-4 h-4" />
                  <span>Disponível para Adoção</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  <Home className="w-4 h-4" />
                  <span>Já encontrou um lar!</span>
                </div>
              )}
            </div>

            {/* Favorite Button */}
            {animal.disponivel && (
              <button
                onClick={() => toggleFavorite(animal.id)}
                className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
              >
                <Heart
                  className={`w-6 h-6 ${
                    favorite ? "fill-accent text-accent" : "text-accent"
                  }`}
                />
              </button>
            )}
          </div>

          {/* Info */}
          <div>
            <h1 className="text-5xl font-bold text-dark-text mb-4">
              {animal.nome}
            </h1>

            <div className="flex items-center gap-2 text-gray-text mb-6">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{animal.localizacao}</span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-gray-text mb-1">Raça</div>
                <div className="font-semibold text-dark-text">{animal.raça}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-gray-text mb-1">Idade</div>
                <div className="font-semibold text-dark-text">{animal.idade}</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="text-sm text-gray-text mb-1">Porte</div>
                <div className="font-semibold text-dark-text">{animal.porte}</div>
              </div>
            </div>

            {/* Story */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-dark-text mb-3">
                História
              </h2>
              <p className="text-gray-text leading-relaxed">{animal.historia}</p>
            </div>

            {/* Temperament */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-dark-text mb-3">
                Temperamento
              </h2>
              <div className="flex flex-wrap gap-2">
                {animal.temperamento.map((trait, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Ideal Home */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-dark-text mb-3">
                Lar Ideal
              </h2>
              <p className="text-gray-text leading-relaxed">{animal.larIdeal}</p>
            </div>

            {/* CTA Button */}
            <Button
              variant="primary"
              disabled={!animal.disponivel}
              className="w-full text-lg py-4"
            >
              {animal.disponivel ? "Quero Adotar!" : "Já encontrou um lar!"}
            </Button>

            {animal.disponivel && (
              <p className="text-sm text-gray-text text-center mt-4">
                Clique para iniciar o processo de adoção
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalProfilePage;
