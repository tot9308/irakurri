export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold text-primary-600 mb-4">Irakurri</h1>
      <p className="text-lg text-neutral-600 mb-8 max-w-xl">
        Irakurri antolak 6-8 urteko haurtzak etxean. Silaba eta hiztegia
        euskaraz, aukeratutako fonema gehiago.
      </p>
      <div className="flex gap-4">
        <button className="btn-primary" onClick={() => (window.location.href = "/invitado")}>
          Joan Estanon bihurtuz (invitado)
        </button>
        <button className="btn-secondary" onClick={() => (window.location.href = "/login")}>
          Saioa hasi (adulta)
        </button>
      </div>
    </div>
  );
}
