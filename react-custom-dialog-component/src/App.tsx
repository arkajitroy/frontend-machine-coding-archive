import { useState } from "react";
import CustomDialog from "./components/dialog";

const App = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <main>
      <h3>Custom React Dialog Box</h3>
      <button onClick={() => setDialogOpen(true)}>Open Dialog</button>

      <CustomDialog isOpen={isDialogOpen} onClose={() => setDialogOpen(false)} showCloseButton>
        <h2 id="dialog-title">Welcome</h2>
        <p>This is a scalable, accessible, and animated custom dialog component.</p>
        <button onClick={() => setDialogOpen(false)}>Okay</button>
      </CustomDialog>
    </main>
  );
};

export default App;
