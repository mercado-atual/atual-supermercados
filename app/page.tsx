import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="w-full flex-1">

      {/* HERO ADEGA COM FOTO REAL (CSS BACKGROUND) */}
      <section
        className="relative h-[50vh] md:h-[55vh] w-full flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('/adega/01_entrada.jpg.jpg')",
          backgroundSize: "85%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay escuro para contraste */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Flâmula com texto */}
        <div className="relative z-10 px-6 py-6 max-w-2xl mx-4 bg-red-600/40 backdrop-blur-sm rounded-xl border border-red-500/30 shadow-xl">
          <h1 className="text-white text-2xl md:text-4xl font-extrabold mb-2 drop-shadow-lg">
            ADEGA ATUAL<br />SUPERMERCADOS
          </h1>

          <p className="text-white text-sm md:text-base mb-3 font-medium drop-shadow-md">
            Qualidade e variedade para quem aprecia bons momentos.
          </p>

          <p className="text-white/95 text-xs font-semibold drop-shadow">
            Beba com moderação. Venda proibida para menores de 18 anos.
          </p>
        </div>
      </section>

      {/* DESTAQUES DA ADEGA */}
      <section className="bg-white py-14 px-6">
        <h2 className="text-zinc-900 text-3xl font-bold text-center mb-10">
          Destaques da Adega
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">

          <Card titulo="Whiskys" imagem="/adega/02_whisky.jpg.jpg" />
          <Card titulo="Vinhos" imagem="/adega/03_vinhos.jpg.jpg" />
          <Card titulo="Gins" imagem="/adega/04_gins.jpg.jpg" />
          <Card titulo="Variedade" imagem="/adega/05_prateleira.jpg.jpg" />

        </div>
      </section>

      </main>
      
      <Footer />
    </div>
  );
}

function Card({ titulo, imagem }: { titulo: string; imagem: string }) {
  return (
    <div
      className="relative h-72 rounded-xl overflow-hidden shadow-lg cursor-pointer group"
      style={{
        backgroundImage: `url('${imagem}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30 flex items-end justify-center pb-4 group-hover:from-black/80 transition-colors">
        <span className="text-white text-lg font-semibold drop-shadow-lg">
          {titulo}
        </span>
      </div>
    </div>
  );
}
