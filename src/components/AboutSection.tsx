import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import aboutTexture from "@/assets/about-texture.jpg";

const AboutSection = () => {
  return (
    <section className="py-24 md:py-32 bg-[#020C1B]">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-card">
              <img
                src={aboutTexture}
                alt="Textura do algodão premium Selah"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-sm font-sans text-muted-foreground uppercase tracking-[0.2em] mb-4">
              O Projeto
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6 leading-tight">
              Mais do que algodão.
              <br />
              <span className="italic">Uma pausa.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Selah nasce da convicção de que a fé não precisa ser barulhenta
              para ser profunda. Nossas peças carregam silêncio, propósito e a
              beleza de uma vida vivida com intenção.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Cada camiseta é produzida com algodão premium, corte contemporâneo
              e o cuidado de quem acredita que vestir a Palavra é um ato
              cotidiano de adoração.
            </p>
            <Link
              to="/sobre"
              className="text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Conheça o manifesto completo →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
