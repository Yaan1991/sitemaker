import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/i18n/useLanguage";

const PRIVACY_CSS = `
  html.privacy-page, html.privacy-page body {
    margin: 0;
    padding: 0;
    background: #080808;
    color: #e8e8e8;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Helvetica, Arial, sans-serif;
    font-weight: 300;
    line-height: 1.6;
    letter-spacing: 0.2px;
  }
  .privacy-page * { box-sizing: border-box; }
  .privacy-page .wrap {
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 24px 80px;
  }
  .privacy-page header {
    border-bottom: 1px solid #2a2a2a;
    padding-bottom: 20px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .privacy-page .logoK {
    color: #E6D36A;
    font-size: 22px;
    font-weight: 200;
    letter-spacing: 4px;
  }
  .privacy-page .logoPipe {
    color: #9a9a9a;
    font-weight: 100;
  }
  .privacy-page .logoName {
    color: #9a9a9a;
    font-size: 12px;
    letter-spacing: 3px;
    font-weight: 300;
  }
  .privacy-page h1 {
    font-size: 24px;
    font-weight: 200;
    color: #e8e8e8;
    letter-spacing: 1px;
    margin: 0 0 6px;
  }
  .privacy-page h2 {
    font-size: 13px;
    font-weight: 400;
    color: #E6D36A;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 36px 0 12px;
  }
  .privacy-page h3 {
    font-size: 15px;
    font-weight: 400;
    color: #e8e8e8;
    margin: 20px 0 8px;
  }
  .privacy-page p, .privacy-page li {
    font-size: 14px;
    color: #e8e8e8;
    font-weight: 300;
  }
  .privacy-page .meta {
    color: #9a9a9a;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .privacy-page a {
    color: #E6D36A;
    text-decoration: none;
    border-bottom: 1px solid rgba(230, 211, 106, 0.3);
  }
  .privacy-page a:hover { border-bottom-color: #E6D36A; }
  .privacy-page hr {
    border: none;
    border-top: 1px solid #2a2a2a;
    margin: 56px 0;
  }
  .privacy-page ul { padding-left: 20px; }
  .privacy-page li { margin-bottom: 6px; }
  .privacy-page footer {
    margin-top: 56px;
    padding-top: 20px;
    border-top: 1px solid #2a2a2a;
    color: #9a9a9a;
    font-size: 11px;
    letter-spacing: 1.5px;
    text-align: center;
  }
`;

export default function PrivacyKuzmichevTuner() {
  const { lang, prefix } = useLanguage();
  const canonical = `https://iansound.pro${prefix}/legal/kuzmichev-tuner-privacy`;
  return (
    <>
      <Helmet>
        <html lang={lang} className="privacy-page" />
        <title>Privacy Policy — Kuzmichev Tuner</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="yandex" content="noindex, nofollow" />
        <meta name="description" content="Privacy Policy for the Kuzmichev Tuner mobile app." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <style dangerouslySetInnerHTML={{ __html: PRIVACY_CSS }} />

      <div className="privacy-page">
        <div className="wrap">
          <header>
            <span className="logoK">K</span>
            <span className="logoPipe">|</span>
            <span className="logoName">KUZMICHEV TOOLS</span>
          </header>

          {/* ============== RU ============== */}
          <div className="meta">Русский</div>
          <h1>Политика конфиденциальности</h1>
          <p className="meta">Kuzmichev Tuner · Обновлено: 25 мая 2026</p>

          <h2>1. Кто мы</h2>
          <p>
            Приложение Kuzmichev Tuner («Приложение») разработано Яном Кузьмичевым («Разработчик»).
            Связаться с нами можно по адресу:{" "}
            <a href="mailto:ianiankay@gmail.com">ianiankay@gmail.com</a>.
          </p>

          <h2>2. Какие данные мы собираем</h2>
          <p>
            <strong>
              Никаких персональных данных мы не собираем, не передаём и не храним на сторонних серверах.
            </strong>
          </p>
          <p>
            Приложение работает полностью локально на вашем устройстве. У нас нет учётных записей,
            регистрации, аналитики, рекламных идентификаторов и сторонних SDK для отслеживания.
          </p>

          <h2>3. Использование микрофона</h2>
          <p>
            Приложение запрашивает доступ к микрофону исключительно для определения частоты звука
            вашего инструмента в режиме тюнера.
          </p>
          <ul>
            <li>Аудиопоток обрабатывается только в оперативной памяти устройства.</li>
            <li>
              Запись звука <strong>не сохраняется</strong> ни на устройстве, ни в облаке.
            </li>
            <li>
              Аудиоданные <strong>не передаются</strong> разработчику или третьим лицам.
            </li>
            <li>
              Вы можете в любой момент отозвать разрешение через настройки операционной системы.
            </li>
          </ul>

          <h2>4. Локально хранимые данные</h2>
          <p>
            Для удобства Приложение сохраняет на вашем устройстве пользовательские настройки:
            эталонную частоту A4, темп метронома, выбранный язык интерфейса и т. п. Эти данные
            не покидают устройство и удаляются вместе с удалением Приложения.
          </p>

          <h2>5. Сторонние ссылки</h2>
          <p>
            Приложение содержит ссылки на внешние ресурсы (платёжный сервис CloudTips для
            добровольной поддержки автора, Telegram-канал автора). Переход по этим ссылкам
            подчиняется политикам конфиденциальности соответствующих сервисов.
          </p>

          <h2>6. Дети</h2>
          <p>
            Приложение не предназначено специально для детей младше 13 лет и не собирает их данные.
          </p>

          <h2>7. Изменения политики</h2>
          <p>
            При изменении политики мы обновим эту страницу и дату в заголовке. Существенные
            изменения дополнительно отразим в описании Приложения в магазине.
          </p>

          <h2>8. Контакты</h2>
          <p>
            Вопросы и запросы: <a href="mailto:ianiankay@gmail.com">ianiankay@gmail.com</a>.
          </p>

          <hr />

          {/* ============== EN ============== */}
          <div className="meta">English</div>
          <h1>Privacy Policy</h1>
          <p className="meta">Kuzmichev Tuner · Updated: May 25, 2026</p>

          <h2>1. Who we are</h2>
          <p>
            Kuzmichev Tuner (the "App") is developed by Ian Kuzmichev (the "Developer").
            Contact: <a href="mailto:ianiankay@gmail.com">ianiankay@gmail.com</a>.
          </p>

          <h2>2. Data we collect</h2>
          <p>
            <strong>
              We do not collect, transmit, or store any personal data on external servers.
            </strong>
          </p>
          <p>
            The App works entirely on your device. There are no accounts, no sign-up, no
            analytics, no advertising identifiers, and no third-party tracking SDKs.
          </p>

          <h2>3. Microphone usage</h2>
          <p>
            The App requests microphone access solely to detect the pitch of your instrument in
            real time while the tuner is in use.
          </p>
          <ul>
            <li>The audio stream is processed only in your device's memory.</li>
            <li>
              Audio is <strong>never recorded</strong> to local storage or the cloud.
            </li>
            <li>
              Audio is <strong>never transmitted</strong> to the Developer or any third party.
            </li>
            <li>
              You can revoke microphone permission at any time in your device's system settings.
            </li>
          </ul>

          <h2>4. Locally stored data</h2>
          <p>
            For your convenience, the App stores user preferences on your device (A4 reference
            frequency, metronome tempo, UI language, etc.). This data never leaves your device
            and is removed when the App is uninstalled.
          </p>

          <h2>5. Third-party links</h2>
          <p>
            The App contains links to external services (the CloudTips payment service for
            voluntary author support; the author's Telegram channel). Following these links is
            governed by the privacy policies of those services.
          </p>

          <h2>6. Children</h2>
          <p>
            The App is not directed at children under 13 and does not knowingly collect data from
            them.
          </p>

          <h2>7. Changes to this policy</h2>
          <p>
            If we change this policy, we will update this page and the date in the header.
            Material changes will also be reflected in the App's store listing.
          </p>

          <h2>8. Contact</h2>
          <p>
            Questions and requests: <a href="mailto:ianiankay@gmail.com">ianiankay@gmail.com</a>.
          </p>

          <footer>K | KUZMICHEV TOOLS</footer>
        </div>
      </div>
    </>
  );
}
