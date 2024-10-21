import {useEffect, useState} from "react";
import {pocket_base} from "../../../lib/pocket_base.ts";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const UnLinkOAuth = () => {
    // Translation
    const { t } = useTranslation();
    const [ loading, setLoading ] = useState(false);
    const [ linkedProviders, setLinkedProviders ] = useState<any>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getProviders().then(() => setLoading(false));
    },[]);

    const getProviders = async () => {
        if(!pocket_base.authStore.model){navigate("/"); return;}
        setLoading(true);
        const response = await pocket_base.collection('users').listExternalAuths(pocket_base.authStore.model.id);
        setLinkedProviders(response);
    }

    const unlinkProvider = async (providerId:string) => {
        if(!pocket_base.authStore.model){navigate("/"); return;}
        await pocket_base.collection('users').unlinkExternalAuth(
            pocket_base.authStore.model.id,
            providerId
        );
        getProviders().then();
        setLoading(false);
    }

    return(
        <div>
            {loading && <div>Loading...</div>}
            <div className="flex">{t('settings.account.unlinkOAuth.title')}</div>
            <div className="flex  py-5">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                        <tr>
                            <th>{t('settings.account.unlinkOAuth.providerName')}</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {linkedProviders.map((provider:any) => (
                            <tr key={provider.id}>
                                <td>{provider.provider}</td>
                                <td><button className="btn" onClick={() => { unlinkProvider(provider.provider).then()}}>{t('settings.account.unlinkOAuth.unlink')}</button> </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default UnLinkOAuth;