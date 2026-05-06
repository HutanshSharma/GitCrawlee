from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def build_driver():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {
                "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
            },
        )
    except Exception:
        pass

    return driver

GET_FULL_DOM_JS = r"""
function getShadowDOMContent(element) {
  let content = "";
  if (!element) return content;
  if (element.shadowRoot) {
    content += "<shadow-root-start>";
    content += element.shadowRoot.innerHTML;
    content += "<shadow-root-end>";
    let children = element.shadowRoot.querySelectorAll("*");
    children.forEach(child => {
      content += getShadowDOMContent(child);
    });
  } else {
    let children = element.querySelectorAll("*");
    children.forEach(child => {
      if (child.shadowRoot) {
        content += getShadowDOMContent(child);
      }
    });
  }
  return content;
}

let fullHTML = document.documentElement.outerHTML;
let all = document.querySelectorAll("*");
all.forEach(el => {
  if (el.shadowRoot) {
    fullHTML += getShadowDOMContent(el);
  }
});
return fullHTML;
"""

def wait_for_dom_ready(driver, timeout=15):
    try:
        WebDriverWait(driver, timeout).until(
            lambda d: d.execute_script("return document.readyState") == "complete"
        )
    except TimeoutException:
        # Continue with best-effort rendering if the page stays busy.
        pass


def scrapper(page_url, extract, max_wait=100):
    driver = build_driver()
    try:
        driver.get(page_url)
        wait_for_dom_ready(driver)
        prev_height = -1
        stable_iterations = 0
        start = time.time()
        while True:
            driver.execute_script("window.scrollTo(0, document.documentElement.scrollHeight);")
            time.sleep(1.0)
            try:
                current_height = driver.execute_script(
                "return document.documentElement.scrollHeight"
                )
            except Exception:
                current_height = prev_height

            if current_height == prev_height:
                stable_iterations += 1
            else:
                stable_iterations = 0

            prev_height = current_height

            if stable_iterations >= 3 or (time.time() - start) > max_wait:
                break
        full_html = driver.execute_script(GET_FULL_DOM_JS)

    finally:
        driver.quit()

    soup = BeautifulSoup(full_html, "html.parser")
    
    data = extract(soup)

    return data

    

