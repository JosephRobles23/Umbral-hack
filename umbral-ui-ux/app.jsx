/* ============================================================
   UMBRAL — App shell + routing
   ============================================================ */
function App() {
  const [route, setRoute] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("umbral_route") || "null");
      if (saved && saved.page) return saved;
    } catch (e) {}
    return { page: "dashboard", params: {} };
  });

  function navigate(page, params = {}) {
    // "operative" es la vista de detalle; el item de nav activo sigue siendo "operatives"
    const r = { page, params };
    setRoute(r);
    localStorage.setItem("umbral_route", JSON.stringify(r));
    window.scrollTo({ top: 0 });
  }

  // navItem activo: el detalle resalta "operatives"
  const navRoute = { page: route.page === "operative" ? "operatives" : route.page };
  const fullBleed = route.page === "terminal" || route.page === "graft";

  let page;
  switch (route.page) {
    case "dashboard": page = <DashboardPage navigate={navigate} />; break;
    case "operatives": page = <OperativesPage navigate={navigate} />; break;
    case "operative": page = <OperativeDetailPage route={route} navigate={navigate} />; break;
    case "grill": page = <GrillPage />; break;
    case "terminal": page = <TerminalPage navigate={navigate} />; break;
    case "c4": page = <C4Page />; break;
    case "graft": page = <GraftPage />; break;
    case "policies": page = <PoliciesPage navigate={navigate} />; break;
    default: page = <DashboardPage navigate={navigate} />;
  }

  return (
    <div className="shell">
      <Sidebar route={navRoute} navigate={navigate} />
      <main className="content" data-screen-label={route.page}>
        {fullBleed ? page : <div className="content-inner">{page}</div>}
      </main>
    </div>
  );
}

function Root() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
