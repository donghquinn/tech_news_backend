export const createSearchPasswordMailcontent = (rawPassword: string) =>
  `
    <div>
        <fieldset>
         <p>New Password: </p> ${rawPassword}
        </fieldset>
    </div>
`;

export const createNewsdMailcontent = (newsData: string) =>
  `
    <div>
        <fieldset>
         ${newsData}
        </fieldset>
    </div>
`;
