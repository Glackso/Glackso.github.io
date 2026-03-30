// sidebar.js - Universal Navigation for Gazowiki

const sidebarContent = `
    <center>
        <img src="https://via.placeholder.com/120x120.png?text=Gazowiki+Logo" alt="Gazowiki Logo" width="120" height="120">
        <br><i>The Free Glag Encyclopedia</i>
    </center>
    <br>
    
    <h3>Navigation</h3>
    <ul>
        <li><a href="index.html">Main Page</a></li>
        <li><a href="#">Community Portal</a></li>
        <li><a href="#">Recent Changes</a></li>
        <li><a href="#">Random Page</a></li>
    </ul>

    <h3>Species</h3>
    <ul>
        <li><a href="gembo.html">Gembos</a></li>
        <li><a href="gazo.html">Gazos</a></li>
        <li><a href="giggler.html">Gigglers</a></li>
        <li><a href="#">Gleebers</a></li>
        <li><a href="#">Glaabers</a></li>
        <li><a href="gloober.html">Gloobers</a></li>
        <li><a href="#">Cheerers</a></li>
    </ul>
`;

// Inject the HTML into the sidebar div
document.getElementById('sidebar').innerHTML = sidebarContent;
