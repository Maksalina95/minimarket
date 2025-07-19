body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  background: #fefefe;
}

header {
  background: #e91e63;
  color: white;
  padding: 15px;
  text-align: center;
}

nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
  font-weight: bold;
}

main {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.product-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.product-card img {
  max-width: 100%;
  border-radius: 10px;
  height: 200px;
  object-fit: cover;
}

footer {
  text-align: center;
  padding: 10px;
  background: #eee;
  color: #333;
  font-size: 14px;
}
